const Employee = require("../models/Employee");
const Recommendation = require("../models/Recommendation");
const asyncHandler = require("../middleware/asyncHandler");

function scoreBand(score) {
  if (score >= 85) return "High Performer";
  if (score >= 70) return "Solid Performer";
  return "Needs Support";
}

function localEmployeeRecommendation(employee) {
  const missingLeadership = !employee.skills.some((skill) => /lead|manage|mentor/i.test(skill));
  const lowScore = employee.performanceScore < 70;

  return {
    employee: employee.name,
    status: scoreBand(employee.performanceScore),
    promotionRecommendation:
      employee.performanceScore >= 85
        ? `Recommended for promotion consideration based on a ${employee.performanceScore}/100 performance score and ${employee.experience} years of experience.`
        : "Promotion should wait until performance consistency improves.",
    trainingSuggestions: lowScore
      ? ["Core role fundamentals", "Mentored delivery plan", "Communication practice"]
      : missingLeadership
        ? ["Leadership fundamentals", "System design", "Cross-functional mentoring"]
        : ["Advanced specialization", "Strategic ownership"],
    feedback:
      employee.performanceScore >= 85
        ? `${employee.name} is performing strongly and can take on larger ownership.`
        : `${employee.name} should receive focused coaching with measurable quarterly goals.`,
    priority: employee.performanceScore >= 85 ? "High Priority" : lowScore ? "Improvement Priority" : "Medium Priority",
    ranking: null,
    generatedAt: new Date().toISOString()
  };
}

function localRankingRecommendation(employees) {
  const ranked = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore || b.experience - a.experience)
    .map((employee, index) => ({
      rank: index + 1,
      employee: employee.name,
      department: employee.department,
      performanceScore: employee.performanceScore,
      recommendation:
        employee.performanceScore >= 85
          ? "Promotion pipeline"
          : employee.performanceScore >= 70
            ? "Skill growth plan"
            : "Improvement coaching"
    }));

  return {
    employee: "Multiple employees",
    status: "Ranked recommendations",
    promotionRecommendation: "Review the top-ranked high performers for promotion readiness.",
    trainingSuggestions: ["Leadership path for top performers", "Skill gap training for lower bands"],
    feedback: "Employees are ranked by performance score with experience as a secondary signal.",
    priority: "Portfolio Review",
    ranking: ranked,
    generatedAt: new Date().toISOString()
  };
}

function extractJson(text) {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  } catch (_error) {
    return null;
  }
}

async function callOpenRouter({ mode, employee, employees }) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const model = process.env.OPENROUTER_MODEL || "openai/gpt-5.2";
  const systemPrompt =
    "You are an HR analytics assistant. Return only compact valid JSON with keys: employee, status, promotionRecommendation, trainingSuggestions, feedback, priority, ranking, generatedAt.";
  const data = mode === "rankings" ? employees : employee;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(12000),
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
      "X-Title": "Employee Performance Analytics"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Mode: ${mode}. Analyze this employee performance data and produce promotion, ranking, training, and feedback recommendations: ${JSON.stringify(data)}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter request failed: ${response.status} ${text.slice(0, 160)}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  const parsed = extractJson(content);

  if (!parsed) {
    throw new Error("AI response was not valid JSON");
  }

  return { payload: { ...parsed, generatedAt: parsed.generatedAt || new Date().toISOString() }, model, source: "openrouter" };
}

const recommend = asyncHandler(async (req, res) => {
  const { employeeId, mode = "employee" } = req.body;
  let employee = null;
  let employees = [];

  if (!["employee", "rankings"].includes(mode)) {
    const error = new Error("Mode must be employee or rankings");
    error.statusCode = 400;
    throw error;
  }

  if (mode === "employee") {
    if (!employeeId) {
      const error = new Error("employeeId is required for employee recommendations");
      error.statusCode = 400;
      throw error;
    }

    employee = await Employee.findById(employeeId);
    if (!employee) {
      const error = new Error("Employee not found");
      error.statusCode = 404;
      throw error;
    }
  } else {
    employees = await Employee.find().sort({ performanceScore: -1 });
  }

  let aiResult;
  try {
    aiResult = await callOpenRouter({ mode, employee, employees });
  } catch (error) {
    aiResult = {
      payload: mode === "rankings" ? localRankingRecommendation(employees) : localEmployeeRecommendation(employee),
      model: process.env.OPENROUTER_MODEL || "local-fallback",
      source: "local-fallback",
      warning: error.message
    };
  }

  const recommendation = await Recommendation.create({
    employee: employee?._id || null,
    createdBy: req.user._id,
    mode,
    model: aiResult.model,
    payload: aiResult.payload,
    source: aiResult.source
  });

  res.json({
    ...aiResult.payload,
    id: recommendation._id,
    model: aiResult.model,
    source: aiResult.source,
    warning: aiResult.warning
  });
});

module.exports = { recommend };
