package com.cpm.service;

import com.cpm.dto.AiChatRequest;
import com.cpm.dto.AiChatResponse;
import com.cpm.dto.MockInterviewEvaluateRequest;
import com.cpm.dto.MockInterviewEvaluateResponse;
import com.cpm.entity.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AiService {

    public AiChatResponse processChat(AiChatRequest request, User currentUser) {
        String query = request.getMessage() != null ? request.getMessage().trim().toLowerCase() : "";
        String role = request.getRole() != null ? request.getRole() : (currentUser != null && currentUser.getRole() != null ? currentUser.getRole().name() : "STUDENT");

        StringBuilder reply = new StringBuilder();
        List<String> suggestions = new ArrayList<>();
        String actionType = null;
        String actionUrl = null;

        if (query.contains("resume") || query.contains("ats") || query.contains("cv")) {
            reply.append("### 📄 AI Resume Optimization Tips\n\n")
                 .append("To maximize your **ATS (Applicant Tracking System) score** for campus hiring:\n\n")
                 .append("1. **Quantify your impact**: Use Google's XYZ formula (*Accomplished [X] as measured by [Y], by doing [Z]*). E.g., *'Optimized SQL queries, reducing API latency by 42%'*.\n")
                 .append("2. **Standardize Tech Keywords**: Ensure skills match exact enterprise taxonomy (e.g. *'Java 17'*, *'Spring Boot'*, *'React'*, *'Docker'*).\n")
                 .append("3. **Keep Single-Column Layout**: Multi-column tables and complex graphic elements frequently fail ATS text extraction.\n\n")
                 .append("Would you like to open our interactive **ATS Resume Builder** to check your real-time score?");
            suggestions.add("Generate my professional summary");
            suggestions.add("Polish my project bullet points");
            suggestions.add("Recommended keywords for SDE-1");
            actionType = "NAVIGATE_RESUME";
            actionUrl = "/student/resume-builder";
        } else if (query.contains("interview") || query.contains("mock") || query.contains("practice")) {
            reply.append("### 🎙️ AI Mock Interview Assistant\n\n")
                 .append("Practicing technical communication is the single most effective way to clear campus rounds!\n\n")
                 .append("- **Technical Rounds**: Focus on fundamental memory models, concurrency, database indexing, and REST principles.\n")
                 .append("- **Behavioral (HR) Rounds**: Structure all answers using the **STAR Method** (Situation, Task, Action, Result).\n")
                 .append("- **System Design**: Clarify requirements, estimate capacity, diagram components, and discuss bottleneck trade-offs.\n\n")
                 .append("You can launch our interactive **AI Mock Interview Simulator** right now to practice answering realistic technical questions with instant scoring!");
            suggestions.add("Start Technical SDE Mock Round");
            suggestions.add("Practice Behavioral STAR questions");
            suggestions.add("Top 5 DSA patterns to know");
            actionType = "MOCK_INTERVIEW";
            actionUrl = "/student/mock-interview";
        } else if (query.contains("google") || query.contains("amazon") || query.contains("microsoft")) {
            reply.append("### 🏢 Tier-1 Tech Company Campus Strategy\n\n")
                 .append("For companies like **Google, Microsoft, and Amazon** visiting our campus:\n\n")
                 .append("1. **Online Assessment (OA)**: Typically 2 coding questions on LeetCode Medium/Hard topics (Graphs, DP, Monotonic Stacks, Sliding Window).\n")
                 .append("2. **Technical Round 1 & 2**: Live coding with focus on clean modular code, edge cases (`null`, empty arrays, large bounds), and Big-O time/space complexity analysis.\n")
                 .append("3. **Leadership Principles / Cultural Fit**: Amazon LP questions, Google 'Googliness' (collaboration, ambiguity handling), and project deep dives.\n\n")
                 .append("Ensure your academic CGPA remains above the 7.5 threshold and your profile lists at least 2 production-grade GitHub projects.");
            suggestions.add("What are the top DSA patterns?");
            suggestions.add("How do I explain my projects?");
            suggestions.add("Browse active placement drives");
            actionType = "VIEW_DRIVES";
            actionUrl = "/student/drives";
        } else if (query.contains("job") || query.contains("drive") || query.contains("opening") || query.contains("apply")) {
            reply.append("### 💼 Campus Openings & Recruitment Drives\n\n")
                 .append("The 2026-27 Campus Placement season currently has multiple verified hiring partners:\n\n")
                 .append("- **Google Cloud**: Associate Cloud Engineer / SDE Intern (₹32.5 LPA)\n")
                 .append("- **Microsoft**: Graduate Cloud Solutions Architect (₹28.0 LPA)\n")
                 .append("- **JPMorgan Chase**: Full Stack Java Developer (₹19.5 LPA)\n\n")
                 .append("Check your department eligibility and apply with one click through the Jobs portal.");
            suggestions.add("Check my job eligibility");
            suggestions.add("View my application pipeline");
            suggestions.add("Start AI Mock Interview");
            actionType = "VIEW_JOBS";
            actionUrl = "/student/jobs";
        } else if ("COMPANY".equalsIgnoreCase(role) || "RECRUITER".equalsIgnoreCase(role)) {
            reply.append("### 🤝 Recruiter AI Talent Copilot\n\n")
                 .append("Hello! I can help streamline your campus recruitment process:\n\n")
                 .append("- **Generate Job Descriptions**: Formulate responsibilities and required skill tags from simple role titles.\n")
                 .append("- **Candidate Match Scoring**: Automatically rank our campus student pool against your specific minimum CGPA and tech stack criteria.\n")
                 .append("- **Custom Interview Questions**: Formulate tailored technical screening questions based on student skill proficiencies.\n\n")
                 .append("What role are you currently sourcing candidates for?");
            suggestions.add("Generate SDE Job Description");
            suggestions.add("Find candidates with React & Spring Boot");
            suggestions.add("Generate Technical Interview Questions");
        } else {
            reply.append("### 👋 Welcome to CPM AI Career Copilot!\n\n")
                 .append("I am your intelligent assistant for campus placements, academic records, and career acceleration. Here is how I can assist you today:\n\n")
                 .append("- **ATS Resume Optimization**: Enhance project bullets, generate professional summaries, and find missing keywords.\n")
                 .append("- **AI Mock Interviews**: Practice live technical and behavioral interview questions with instant grading and constructive feedback.\n")
                 .append("- **Company Strategy**: Learn specific hiring patterns for visiting recruiters (Google, Microsoft, Amazon, JPMorgan).\n")
                 .append("- **Preparation Checklists**: Curated guidance on DSA topics, system design, and placement eligibility.");
            suggestions.add("How do I optimize my resume for ATS?");
            suggestions.add("Start an AI Mock Interview");
            suggestions.add("What are recruiters asking this season?");
            suggestions.add("Explore open campus jobs");
        }

        return AiChatResponse.builder()
                .reply(reply.toString())
                .suggestions(suggestions)
                .actionType(actionType)
                .actionUrl(actionUrl)
                .build();
    }

    public List<Map<String, String>> generateMockQuestions(String roleCategory, String roundType, int count) {
        List<Map<String, String>> questions = new ArrayList<>();
        String cat = roleCategory != null ? roleCategory.toLowerCase() : "software engineer";
        String round = roundType != null ? roundType.toUpperCase() : "TECHNICAL";

        if ("SYSTEM_DESIGN".equals(round)) {
            questions.add(Map.of(
                    "id", "sd-1",
                    "question", "Design a scalable URL Shortener service (like bit.ly) that can handle 100 million new URLs per month. How would you structure the database schema, hash generation, and cache layer?",
                    "hint", "Discuss base62 encoding vs MD5 truncation, Redis caching for hot URLs, and horizontal database sharding."
            ));
            questions.add(Map.of(
                    "id", "sd-2",
                    "question", "How would you design a real-time Notification System for a campus portal that delivers push alerts, emails, and WebSocket updates with guaranteed at-least-once delivery?",
                    "hint", "Think message brokers (Kafka/RabbitMQ), fan-out workers, and rate limiting to prevent spamming."
            ));
            questions.add(Map.of(
                    "id", "sd-3",
                    "question", "Design a rate limiter for API gateways to prevent DDoS attacks and enforce per-user request quotas.",
                    "hint", "Explain Token Bucket vs Sliding Window Counter algorithms and Redis distributed locks."
            ));
        } else if ("BEHAVIORAL".equals(round)) {
            questions.add(Map.of(
                    "id", "bh-1",
                    "question", "Tell me about a time when you faced a difficult technical bug or deadline in a group project. How did you resolve the conflict and deliver results?",
                    "hint", "Use the STAR format: Situation, Task, Action you specifically took, and the quantifiable Result."
            ));
            questions.add(Map.of(
                    "id", "bh-2",
                    "question", "Describe a scenario where you had to quickly learn a completely new framework or programming language to complete a deliverable. What was your learning strategy?",
                    "hint", "Highlight curiosity, documentation reading, prototyping, and mentorship from peers."
            ));
            questions.add(Map.of(
                    "id", "bh-3",
                    "question", "Give an example of a project where you took initiative beyond the assigned scope to improve performance or user experience.",
                    "hint", "Focus on proactive ownership, measuring performance before and after, and business impact."
            ));
        } else if ("DSA".equals(round)) {
            questions.add(Map.of(
                    "id", "dsa-1",
                    "question", "Given an array of integers representing stock prices on consecutive days, find the maximum profit you can achieve with at most two transactions. What is your time and space complexity?",
                    "hint", "Consider Dynamic Programming with forward and backward passes, or maintaining four state variables (buy1, sell1, buy2, sell2)."
            ));
            questions.add(Map.of(
                    "id", "dsa-2",
                    "question", "How would you detect a cycle in a directed graph? Explain both Depth First Search (coloring method) and Kahn's algorithm (Topological sort BFS).",
                    "hint", "Mention recursion stack states (VISITING vs VISITED) and in-degree arrays for BFS."
            ));
            questions.add(Map.of(
                    "id", "dsa-3",
                    "question", "Implement an LRU (Least Recently Used) Cache with O(1) get and O(1) put operations. What core data structures would you combine?",
                    "hint", "A Doubly Linked List for O(1) removals and insertions, paired with a Hash Map for O(1) lookups."
            ));
        } else {
            // General Technical
            if (cat.contains("front") || cat.contains("react")) {
                questions.add(Map.of(
                        "id", "fe-1",
                        "question", "Explain how React's Virtual DOM reconciliation algorithm works. What is the significance of unique 'key' props in dynamic lists?",
                        "hint", "Discuss Fiber architecture, diffing heuristics O(n), and avoiding unnecessary DOM repaints."
                ));
                questions.add(Map.of(
                        "id", "fe-2",
                        "question", "What are the key performance differences between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG)? When would you choose each?",
                        "hint", "Talk about Time-To-First-Byte (TTFB), SEO, hydration overhead, and server load."
                ));
            } else if (cat.contains("data") || cat.contains("ai") || cat.contains("ml")) {
                questions.add(Map.of(
                        "id", "ds-1",
                        "question", "Explain the Bias-Variance tradeoff in supervised machine learning models. How do regularization techniques like L1 (Lasso) and L2 (Ridge) affect model weights?",
                        "hint", "L1 yields sparse feature weights (feature selection), L2 prevents weights from exploding."
                ));
                questions.add(Map.of(
                        "id", "ds-2",
                        "question", "How do Transformer self-attention mechanisms differ from traditional Recurrent Neural Networks (RNNs) in processing sequential text data?",
                        "hint", "Parallelized matrix multiplications vs sequential bottleneck, scaled dot-product attention O(n^2)."
                ));
            } else {
                questions.add(Map.of(
                        "id", "be-1",
                        "question", "Explain the difference between optimistic locking and pessimistic locking in enterprise database transactions. When should each be used?",
                        "hint", "Optimistic uses version columns (best for high-read/low-conflict), Pessimistic uses SELECT ... FOR UPDATE."
                ));
                questions.add(Map.of(
                        "id", "be-2",
                        "question", "How does Java memory management work (Heap vs Stack, Garbage Collection Eden/Survivor/Tenured generations)? How do you troubleshoot an OutOfMemoryError?",
                        "hint", "Explain thread stacks vs shared heap, G1GC / ZGC mechanics, and analyzing heap dumps with VisualVM."
                ));
                questions.add(Map.of(
                        "id", "be-3",
                        "question", "What are the core differences between monolithic and microservices architectures regarding data consistency, network latency, and deployment complexity?",
                        "hint", "Discuss two-phase commits vs Saga patterns, API Gateways, and independent deployability."
                ));
            }
        }

        return questions.size() > count ? questions.subList(0, count) : questions;
    }

    public MockInterviewEvaluateResponse evaluateMockAnswer(MockInterviewEvaluateRequest request) {
        String ans = request.getAnswer() != null ? request.getAnswer().trim() : "";
        String round = request.getRoundType() != null ? request.getRoundType() : "TECHNICAL";

        if (ans.length() < 30) {
            return MockInterviewEvaluateResponse.builder()
                    .technicalScore(3)
                    .clarityScore(4)
                    .structureScore(3)
                    .overallScore(3)
                    .feedbackSummary("The answer provided is too brief for an engineering interview. Technical interviewers look for conceptual depth, trade-off comparisons, and concrete examples.")
                    .keyStrengths(List.of("Direct response attempt"))
                    .improvementAreas(List.of(
                            "Expand on core architectural principles and underlying data structures",
                            "Explain 'why' rather than just 'what'",
                            "Provide a concrete scenario or production trade-off"
                    ))
                    .modelIdealAnswerSnippet("A complete answer should first define the core mechanism, outline the architectural trade-offs, explain performance characteristics (Big-O or latency), and cite a real-world scenario.")
                    .build();
        }

        int lengthBonus = Math.min(3, ans.length() / 150);
        int techKeywords = 0;
        String lower = ans.toLowerCase();
        for (String kw : List.of("complexity", "database", "latency", "cache", "performance", "trade-off", "scale", "memory", "algorithm", "architecture", "result", "action", "star")) {
            if (lower.contains(kw)) techKeywords++;
        }

        int techScore = Math.min(10, Math.max(5, 5 + lengthBonus + (techKeywords > 3 ? 2 : 1)));
        int clarityScore = Math.min(10, Math.max(6, 6 + (ans.contains(".") ? 2 : 0)));
        int structureScore = Math.min(10, Math.max(5, (ans.contains("\n") || ans.contains("first") || ans.contains("second") || lower.contains("situation")) ? 8 : 6));
        int overallScore = (techScore + clarityScore + structureScore) / 3;

        List<String> strengths = new ArrayList<>();
        strengths.add("Clear and articulate technical terminology used");
        if (techKeywords >= 2) strengths.add("Demonstrated awareness of system constraints and performance factors");
        if (ans.length() > 200) strengths.add("Well-elaborated explanation showing analytical depth");

        List<String> improvements = new ArrayList<>();
        if (!lower.contains("trade-off") && !lower.contains("cost")) {
            improvements.add("Explicitly discuss trade-offs (e.g. Memory vs CPU, Consistency vs Availability)");
        }
        if (!lower.contains("o(") && round.equals("DSA")) {
            improvements.add("Explicitly state the Big-O Time and Space Complexity bounds");
        }
        if (improvements.isEmpty()) {
            improvements.add("Consider citing edge cases and failure handling strategies");
        }

        return MockInterviewEvaluateResponse.builder()
                .technicalScore(techScore)
                .clarityScore(clarityScore)
                .structureScore(structureScore)
                .overallScore(overallScore)
                .feedbackSummary("Strong answer! You communicated key concepts clearly with relevant technical vocabulary. Incorporating explicit edge cases and failure modes will elevate your answer to senior candidate level.")
                .keyStrengths(strengths)
                .improvementAreas(improvements)
                .modelIdealAnswerSnippet("Ideal approach: 1. State fundamental definition. 2. Compare alternatives. 3. Detail time/space or throughput implications. 4. Summarize edge cases and failure handling.")
                .build();
    }

    public Map<String, String> polishResumeBullet(String text, String roleTarget) {
        if (text == null || text.trim().isEmpty()) {
            text = "Worked on web backend using Java and SQL";
        }
        String cleaned = text.trim();
        String polished = "Architected high-throughput backend microservices using Java 17 and Spring Boot, optimizing PostgreSQL indexing to decrease database query latency by 38% across 10,000+ daily concurrent requests.";
        
        if (cleaned.toLowerCase().contains("front") || cleaned.toLowerCase().contains("react")) {
            polished = "Engineered responsive client-side interface in React and Tailwind CSS with state memoization, reducing bundle load time by 45% and elevating Lighthouse web vitals to 96/100.";
        } else if (cleaned.toLowerCase().contains("data") || cleaned.toLowerCase().contains("python")) {
            polished = "Developed predictive machine learning classification pipelines in Python and Scikit-Learn, attaining 92.4% validation F1-score across 50,000+ customer records.";
        }

        return Map.of(
                "original", cleaned,
                "polished", polished,
                "formulaUsed", "Google XYZ Formula (Accomplished [X], measured by [Y], by doing [Z])",
                "keywordsAdded", "High-throughput, Microservices, Indexing Optimization, Concurrency"
        );
    }

    public Map<String, String> generateCareerSummary(String fullName, String department, Double cgpa, List<String> skills) {
        String dept = department != null ? department : "Computer Science & Engineering";
        String skillStr = skills != null && !skills.isEmpty() ? String.join(", ", skills.subList(0, Math.min(5, skills.size()))) : "Java, Spring Boot, React, Cloud Computing";
        double score = cgpa != null ? cgpa : 8.6;

        String summary = String.format(
                "Results-driven %s graduate with a proven academic record (CGPA: %.2f/10.0) and expertise in %s. Passionate about engineering scalable, fault-tolerant software architectures and contributing to high-impact enterprise solutions.",
                dept, score, skillStr
        );

        return Map.of("summary", summary);
    }

    public List<String> recommendAtsKeywords(String targetRole) {
        String role = targetRole != null ? targetRole.toLowerCase() : "software engineer";
        if (role.contains("cloud") || role.contains("devops")) {
            return List.of("AWS", "Kubernetes", "Docker", "Terraform", "CI/CD Pipelines", "Prometheus", "Microservices Architecture", "Linux Shell Scripting", "Infrastructure as Code");
        } else if (role.contains("front") || role.contains("web")) {
            return List.of("React.js", "TypeScript", "Redux Toolkit", "Next.js", "Tailwind CSS", "RESTful APIs", "Webpack / Vite", "Web Vitals Optimization", "Jest & React Testing Library");
        } else if (role.contains("data") || role.contains("ml") || role.contains("ai")) {
            return List.of("Python", "Pandas", "PyTorch", "TensorFlow", "Scikit-Learn", "Feature Engineering", "SQL Data Warehousing", "Apache Spark", "Model Deployment (FastAPI)");
        } else {
            return List.of("Java 17", "Spring Boot", "REST APIs", "Microservices", "PostgreSQL", "Docker", "Data Structures & Algorithms", "Unit Testing (JUnit/Mockito)", "Git Version Control");
        }
    }

    public Map<String, String> generateJobDescription(String roleTitle, String companyName, String industry) {
        String title = roleTitle != null && !roleTitle.isEmpty() ? roleTitle : "Associate Software Engineer";
        String comp = companyName != null && !companyName.isEmpty() ? companyName : "Enterprise Technology Partner";

        String description = String.format(
                "%s is seeking passionate, analytical %s graduates to join our campus engineering cohort. You will collaborate with cross-functional distributed teams to architect, deploy, and support mission-critical software systems that operate at enterprise scale.",
                comp, title
        );

        String requirements = "• Bachelor's Degree in Computer Science, Information Technology, or relevant engineering disciplines.\n" +
                "• Strong foundational knowledge of Object-Oriented Programming, Data Structures, and Algorithms.\n" +
                "• Familiarity with modern web frameworks (React, Spring Boot, Node.js) and database querying (SQL/NoSQL).\n" +
                "• Excellent problem-solving mindset and collaborative team communication skills.";

        String requiredSkills = "Java, Spring Boot, React, SQL, Git, Docker, REST APIs";

        return Map.of(
                "title", title,
                "description", description,
                "requirements", requirements,
                "requiredSkills", requiredSkills
        );
    }

    public List<String> generateCandidateQuestions(String candidateName, String jobTitle, List<String> matchedSkills, List<String> missingSkills) {
        List<String> questions = new ArrayList<>();
        questions.add(String.format("Walk us through the most architecturally challenging project on your profile. What technical trade-offs did you make?"));
        
        if (matchedSkills != null && !matchedSkills.isEmpty()) {
            String topSkill = matchedSkills.get(0);
            questions.add(String.format("You have demonstrated proficiency in %s. How would you handle scaling and concurrency bottlenecks in a production system using %s?", topSkill, topSkill));
        }

        if (missingSkills != null && !missingSkills.isEmpty()) {
            String missing = missingSkills.get(0);
            questions.add(String.format("Our team utilizes %s extensively. Describe your approach to picking up new toolchains like %s quickly when joining a fast-paced team.", missing, missing));
        }

        questions.add("Describe a situation where a production service or application experienced an unexpected failure. How did you diagnose and remediate the issue?");
        return questions;
    }
}
