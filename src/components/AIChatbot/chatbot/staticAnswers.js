const staticAnswers = {
  "tell me about santosh.": `
Santosh Chaurasia is a Data Analyst with a background in Information Technology and Data Science.

He has experience working with Python, SQL, Excel, Power BI, and data analysis. He has worked on multiple data analytics projects involving customer churn, employee attrition, AI impact on jobs, and market analysis.

He is also pursuing an M.Sc. in Data Science.
`,

  "what are santosh's skills?": `
Santosh's key skills include:

• Python
• SQL
• Microsoft Excel
• Power BI
• Data Analysis
• Data Visualization
• Pandas
• NumPy
• Matplotlib
• Seaborn
• Scikit-learn
• MySQL
`,

  "what are santosh's projects?": `
Santosh has worked on multiple projects, including:

• IT Employee Attrition Analysis
• AI Impact on IT Jobs & Market Demand Analysis
• Telco Customer Churn Analysis
• College Event Alert App
• Student, Teacher and Parents Feedback App

His data analytics projects use tools such as Python, SQL, Excel, and Power BI.
`,

  "what is santosh's education?": `
Santosh completed his B.Sc. in Information Technology in 2025 with a CGPA of 8.70.

His academic background also includes:
• HSC – Maharashtra State Board
• SSC – Maharashtra State Board

He is pursuing an M.Sc. in Data Science at the University of Mumbai.
`,

  "what is santosh's work experience?": `
Santosh has professional experience in IT and data analytics.

His experience includes:

• IT Helpdesk Executive at Allied Digital
• Data Analyst Intern at QSpiders

His work has involved IT support, ticket and incident data analysis, Excel reporting, SLA monitoring, dashboards, and data analysis.
`,

  "tell me about santosh's certifications.": `
Santosh has completed multiple certifications and professional learning programs related to data analytics, data visualization, data science, and professional development.

The complete and latest list of certifications is available in the Certifications section of his portfolio.
`,

  "what is the ai impact project?": `
The AI Impact on IT Jobs & Market Demand Analysis project analyzes the impact of Artificial Intelligence on jobs, salaries, hiring trends, layoffs, and skill demand.

The project uses Python, SQL, Excel, and Power BI to transform the data into meaningful business insights.
`,

  "what is the it employee attrition project?": `
The IT Employee Attrition Analysis project focuses on understanding why employees leave organizations.

The analysis includes factors such as salary, experience, work-life balance, department, and other employee-related factors to identify patterns associated with employee attrition.

The project uses data analytics tools including Python, SQL, Excel, and Power BI.
`,

  "what is the customer churn project?": `
The Telco Customer Churn Analysis project analyzes customer turnover in the telecommunications industry.

It studies factors such as contract type, payment method, monthly charges, internet services, technical support, and customer tenure to identify factors associated with customer churn.

The project uses Python, SQL, Excel, Power BI, and Power Query.
`,

  "tell me about all projects.": `
Santosh has worked on multiple academic and data analytics projects:

• IT Employee Attrition Analysis – analyzes factors influencing employee attrition.
• AI Impact on IT Jobs & Market Demand Analysis – studies AI's impact on jobs, salaries, hiring trends, layoffs, and skill demand.
• Telco Customer Churn Analysis – analyzes customer churn and the factors influencing customer turnover.
• College Event Alert App – an Android application developed using Java and Firebase.
• Student, Teacher and Parents Feedback App – an application designed for collecting feedback from students, teachers, and parents.
`,

  "what is santosh's career goal?": `
Santosh's professional focus is centered on Data Analytics and Data Science.

He aims to build his career in the data field by applying Python, SQL, Excel, Power BI, and analytical skills to solve real-world business problems.
`,

  "what did santosh study?": `
Santosh studied Information Technology during his B.Sc. IT degree and is pursuing an M.Sc. in Data Science.

His academic and professional interests are focused on Data Analytics and Data Science.
`,

  "where did santosh study?": `
Santosh completed his B.Sc. in Information Technology and is pursuing an M.Sc. in Data Science at the University of Mumbai.

His SSC and HSC education was completed under the Maharashtra State Board.
`,

  "what degree does santosh have?": `
Santosh has completed a B.Sc. in Information Technology.

He is also pursuing an M.Sc. in Data Science at the University of Mumbai.
`,

  "what did santosh do at qspiders?": `
Santosh worked as a Data Analyst Intern at QSpiders.

His learning and work involved data analytics technologies such as Python, SQL, Excel, and Power BI.
`,

  "what does santosh do at allied digital?": `
Santosh currently works as an IT Helpdesk Executive at Allied Digital.

His work includes IT support along with analyzing incident and ticketing data, preparing Excel reports, monitoring SLA compliance, and creating reports and dashboards.
`,

  "what tools does santosh use?": `
Santosh works with several data analytics and technology tools, including:

• Python
• SQL / MySQL
• Microsoft Excel
• Power BI
• Pandas
• NumPy
• Matplotlib
• Seaborn
• Scikit-learn
`,

  "what python skills does santosh have?": `
Santosh uses Python for data analysis, data cleaning, exploratory data analysis, visualization, and machine learning-related tasks.

His Python toolkit includes Pandas, NumPy, Matplotlib, Seaborn, and Scikit-learn.
`,

  "what sql skills does santosh have?": `
Santosh uses SQL for working with structured data, querying datasets, filtering and analyzing records, and generating business insights.

He has worked with MySQL.
`,

  "what excel skills does santosh have?": `
Santosh uses Microsoft Excel for data analysis and reporting.

His Excel skills include Pivot Tables, VLOOKUP, Conditional Formatting, charts, and dashboard-related reporting.
`,

  "what power bi skills does santosh have?": `
Santosh uses Power BI to create interactive dashboards and visualize business insights.

He has worked with data preparation, visualizations, dashboards, slicers, and analytical reporting.
`,

  "how can i contact santosh?": `
You can contact Santosh through the contact information provided in the Contact section of his portfolio.
`,

  "where can i find santosh online?": `
Santosh's professional and social links are available through the links provided on his portfolio website.
`,

  "show santosh's resume.": `
Santosh's resume is available through the Resume section of his portfolio.
`,

  "what is included in santosh's resume?": `
Santosh's resume includes information about his education, skills, professional experience, projects, certifications, and other relevant professional details.
`,

  /* =======================================================
     GREETINGS
  ======================================================= */

  "hello": `
Hello! I'm Santosh AI, the assistant for Santosh Chaurasia's portfolio. Feel free to ask me about his skills, projects, education, or experience.
`,

  "hi": `
Hi there! I'm Santosh AI. Ask me anything about Santosh's skills, projects, or professional background.
`,

  "hey": `
Hey! I'm Santosh AI. I can help you learn about Santosh's skills, projects, education, and experience.
`,

  "good morning": `
Good morning! I'm Santosh AI. How can I help you learn about Santosh today?
`,

  "good afternoon": `
Good afternoon! Feel free to ask me anything about Santosh's skills, projects, or experience.
`,

  "good evening": `
Good evening! I'm here to help you learn more about Santosh's work. What would you like to know?
`,

  "how are you?": `
I'm doing well, thank you for asking! I'm here to help you learn about Santosh's skills, projects, and professional background. What would you like to know?
`,

  /* =======================================================
     THANKS / CLOSING
  ======================================================= */

  "thanks": `
You're welcome! Let me know if you have any other questions about Santosh.
`,

  "thank you": `
You're welcome! Feel free to ask anything else about Santosh's skills, projects, or experience.
`,

  "ok": `
Got it! Let me know if there's anything else you'd like to know about Santosh.
`,

  "okay": `
Sounds good! Feel free to ask if you have more questions about Santosh.
`,

  "bye": `
Thanks for stopping by! Feel free to come back anytime you have questions about Santosh.
`,

  "goodbye": `
Goodbye! Have a great day, and feel free to return if you'd like to know more about Santosh.
`,

  /* =======================================================
     ABOUT THE ASSISTANT
  ======================================================= */

  "who are you?": `
I'm Santosh AI, a chatbot built to answer questions about Santosh Chaurasia's skills, projects, education, and professional experience.
`,

  "what is your name?": `
I'm Santosh AI, the assistant for Santosh Chaurasia's portfolio.
`,

  "what can you do?": `
I can answer questions about Santosh's skills, projects, education, work experience, and certifications. Just ask me anything about his professional background!
`,

  "are you a bot?": `
Yes, I'm an AI assistant built to help you learn about Santosh's skills, projects, and professional background.
`,

  "are you real?": `
I'm an AI assistant, not a real person — but everything I share about Santosh comes from real, verified information in his portfolio.
`,

  "are you human?": `
No, I'm an AI assistant. I'm here to answer questions about Santosh's professional background using information from his portfolio.
`,
};

export default staticAnswers;