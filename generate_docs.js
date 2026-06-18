const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumberElement, PageBreak, Header, Footer, TabStopType,
  TabStopPosition
} = require('docx');
const fs = require('fs');

// ── helpers ────────────────────────────────────────────────────────────────
const border  = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, ...opts })]
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun(text)]
  });
}
function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    children: [new TextRun(text)]
  });
}
function spacer() {
  return new Paragraph({ children: [new TextRun('')] });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function headerRow(cells, widths) {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: '1A73E8', type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, color: 'FFFFFF', font: 'Arial', size: 22 })] })]
    }))
  });
}
function dataRow(cells, widths, shade = 'FFFFFF') {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      borders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill: shade, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, font: 'Arial', size: 22 })] })]
    }))
  });
}

// ── document ───────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'numbers',
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: '1A73E8' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1A73E8', space: 1 } } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: '333333' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1A73E8', space: 1 } },
          children: [new TextRun({ text: 'Personal Finance Tracker  |  Project Documentation', font: 'Arial', size: 20, color: '555555' })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC', space: 1 } },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'MCA Internship Project  |  St. Joseph\'s College, Tiruchirappalli', font: 'Arial', size: 18, color: '888888' }),
            new TextRun({ text: '\tPage ', font: 'Arial', size: 18, color: '888888' }),
            new TextRun({ children: [new PageNumberElement()], font: 'Arial', size: 18, color: '888888' })
          ]
        })]
      })
    },
    children: [

      // ── COVER PAGE ────────────────────────────────────────────────────────
      spacer(), spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'PERSONAL FINANCE TRACKER', bold: true, size: 52, font: 'Arial', color: '1A73E8' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: 'Project Documentation', size: 32, font: 'Arial', color: '555555' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'MCA Internship Project', size: 26, font: 'Arial', color: '888888' })]
      }),
      spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Technology Stack:  Java  |  Spring Boot  |  MySQL  |  HTML/CSS/JS', size: 22, font: 'Arial', color: '444444' })]
      }),
      spacer(), spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'Submitted by: Santhosh', bold: true, size: 26, font: 'Arial' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: 'MCA — St. Joseph\'s College (Autonomous), Tiruchirappalli', size: 22, font: 'Arial', color: '555555' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Batch 2025  |  Semester Internship', size: 22, font: 'Arial', color: '888888' })]
      }),
      pageBreak(),

      // ── 1. PROJECT OVERVIEW ───────────────────────────────────────────────
      heading1('1. Project Overview'),
      para('Personal Finance Tracker is a web-based application that allows users to manage their income and expenses and view a real-time financial summary. It is developed as an MCA semester internship project using Java Spring Boot for the backend and plain HTML/CSS/JavaScript for the frontend.'),
      spacer(),

      heading2('1.1 Objectives'),
      bullet('Record, view, and delete income entries per user'),
      bullet('Record, view, and delete expense entries per user'),
      bullet('Manage user profiles (Add, Edit, Delete)'),
      bullet('Display financial summary: Total Income, Total Expense, Balance'),
      spacer(),

      heading2('1.2 Technology Stack'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          headerRow(['Layer', 'Technology', 'Purpose'], [3120, 3120, 3120]),
          dataRow(['Frontend', 'HTML5, CSS3, JavaScript', 'User Interface'], [3120, 3120, 3120], 'F8FBFF'),
          dataRow(['Backend', 'Java 17, Spring Boot 3.2', 'REST API'], [3120, 3120, 3120]),
          dataRow(['ORM', 'Spring Data JPA / Hibernate', 'Database Mapping'], [3120, 3120, 3120], 'F8FBFF'),
          dataRow(['Database', 'MySQL 8', 'Data Storage'], [3120, 3120, 3120]),
          dataRow(['Build Tool', 'Maven', 'Dependency Management'], [3120, 3120, 3120], 'F8FBFF'),
        ]
      }),
      spacer(),
      pageBreak(),

      // ── 2. SYSTEM ARCHITECTURE ────────────────────────────────────────────
      heading1('2. System Architecture'),
      para('The application follows a standard 3-tier architecture:'),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
          headerRow(['Tier', 'Component', 'Responsibility'], [2340, 3510, 3510]),
          dataRow(['Presentation', 'HTML/CSS/JS Pages', 'UI rendering, Fetch API calls'], [2340, 3510, 3510], 'F8FBFF'),
          dataRow(['Business Logic', 'Spring Boot Services', 'Validation, calculations, rules'], [2340, 3510, 3510]),
          dataRow(['Data', 'MySQL via Spring Data JPA', 'CRUD, relationships, queries'], [2340, 3510, 3510], 'F8FBFF'),
        ]
      }),
      spacer(),

      heading2('2.1 Spring Boot Package Structure'),
      bullet('com.finance.tracker                  — Main application class'),
      bullet('com.finance.tracker.entity           — JPA Entity classes'),
      bullet('com.finance.tracker.repository       — Spring Data JPA repositories'),
      bullet('com.finance.tracker.service          — Business logic layer'),
      bullet('com.finance.tracker.controller       — REST API endpoints'),
      bullet('com.finance.tracker.config           — CORS and app configuration'),
      spacer(),
      pageBreak(),

      // ── 3. DATABASE DESIGN ────────────────────────────────────────────────
      heading1('3. Database Design'),
      para('Database Name: finance_tracker'),
      spacer(),

      heading2('3.1 Table: users'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          headerRow(['Column', 'Type', 'Constraints', 'Description'], [2340, 2340, 2340, 2340]),
          dataRow(['id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique user ID'], [2340, 2340, 2340, 2340], 'F8FBFF'),
          dataRow(['name', 'VARCHAR(100)', 'NOT NULL', 'Full name'], [2340, 2340, 2340, 2340]),
          dataRow(['email', 'VARCHAR(100)', 'NOT NULL, UNIQUE', 'Email address'], [2340, 2340, 2340, 2340], 'F8FBFF'),
        ]
      }),
      spacer(),

      heading2('3.2 Table: income'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          headerRow(['Column', 'Type', 'Constraints', 'Description'], [2340, 2340, 2340, 2340]),
          dataRow(['id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique income ID'], [2340, 2340, 2340, 2340], 'F8FBFF'),
          dataRow(['source', 'VARCHAR(100)', 'NOT NULL', 'Income source name'], [2340, 2340, 2340, 2340]),
          dataRow(['amount', 'DECIMAL(10,2)', 'NOT NULL', 'Income amount'], [2340, 2340, 2340, 2340], 'F8FBFF'),
          dataRow(['date', 'DATE', 'NOT NULL', 'Date of income'], [2340, 2340, 2340, 2340]),
          dataRow(['user_id', 'INT', 'FOREIGN KEY → users(id)', 'Owner user reference'], [2340, 2340, 2340, 2340], 'F8FBFF'),
        ]
      }),
      spacer(),

      heading2('3.3 Table: expense'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          headerRow(['Column', 'Type', 'Constraints', 'Description'], [2340, 2340, 2340, 2340]),
          dataRow(['id', 'INT', 'PRIMARY KEY, AUTO_INCREMENT', 'Unique expense ID'], [2340, 2340, 2340, 2340], 'F8FBFF'),
          dataRow(['category', 'VARCHAR(100)', 'NOT NULL', 'Expense category'], [2340, 2340, 2340, 2340]),
          dataRow(['amount', 'DECIMAL(10,2)', 'NOT NULL', 'Expense amount'], [2340, 2340, 2340, 2340], 'F8FBFF'),
          dataRow(['date', 'DATE', 'NOT NULL', 'Date of expense'], [2340, 2340, 2340, 2340]),
          dataRow(['user_id', 'INT', 'FOREIGN KEY → users(id)', 'Owner user reference'], [2340, 2340, 2340, 2340], 'F8FBFF'),
        ]
      }),
      spacer(),
      pageBreak(),

      // ── 4. API ENDPOINTS ──────────────────────────────────────────────────
      heading1('4. REST API Endpoints'),

      heading2('4.1 User APIs  —  Base: /api/users'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 2808, 2496, 2496],
        rows: [
          headerRow(['Method', 'Endpoint', 'Action', 'Response'], [1560, 2808, 2496, 2496]),
          dataRow(['GET',    '/api/users',     'Get all users',   '200 OK + List<User>'],   [1560, 2808, 2496, 2496], 'F8FBFF'),
          dataRow(['GET',    '/api/users/{id}','Get user by ID',  '200 OK + User'],          [1560, 2808, 2496, 2496]),
          dataRow(['POST',   '/api/users',     'Create user',     '200 OK + User'],          [1560, 2808, 2496, 2496], 'F8FBFF'),
          dataRow(['PUT',    '/api/users/{id}','Update user',     '200 OK + User'],          [1560, 2808, 2496, 2496]),
          dataRow(['DELETE', '/api/users/{id}','Delete user',     '200 OK + message'],       [1560, 2808, 2496, 2496], 'F8FBFF'),
        ]
      }),
      spacer(),

      heading2('4.2 Income APIs  —  Base: /api/incomes'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 3120, 2340, 2340],
        rows: [
          headerRow(['Method', 'Endpoint', 'Action', 'Response'], [1560, 3120, 2340, 2340]),
          dataRow(['GET',    '/api/incomes',              'Get all incomes',       '200 OK + List<Income>'], [1560, 3120, 2340, 2340], 'F8FBFF'),
          dataRow(['GET',    '/api/incomes/user/{userId}','Get incomes by user',   '200 OK + List<Income>'], [1560, 3120, 2340, 2340]),
          dataRow(['POST',   '/api/incomes/{userId}',     'Add income for user',   '200 OK + Income'],       [1560, 3120, 2340, 2340], 'F8FBFF'),
          dataRow(['DELETE', '/api/incomes/{id}',         'Delete income by ID',   '200 OK + message'],      [1560, 3120, 2340, 2340]),
        ]
      }),
      spacer(),

      heading2('4.3 Expense APIs  —  Base: /api/expenses'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 3120, 2340, 2340],
        rows: [
          headerRow(['Method', 'Endpoint', 'Action', 'Response'], [1560, 3120, 2340, 2340]),
          dataRow(['GET',    '/api/expenses',              'Get all expenses',      '200 OK + List<Expense>'], [1560, 3120, 2340, 2340], 'F8FBFF'),
          dataRow(['GET',    '/api/expenses/user/{userId}','Get expenses by user',  '200 OK + List<Expense>'], [1560, 3120, 2340, 2340]),
          dataRow(['POST',   '/api/expenses/{userId}',     'Add expense for user',  '200 OK + Expense'],       [1560, 3120, 2340, 2340], 'F8FBFF'),
          dataRow(['DELETE', '/api/expenses/{id}',         'Delete expense by ID',  '200 OK + message'],       [1560, 3120, 2340, 2340]),
        ]
      }),
      spacer(),

      heading2('4.4 Dashboard API'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 3120, 2340, 2340],
        rows: [
          headerRow(['Method', 'Endpoint', 'Action', 'Response'], [1560, 3120, 2340, 2340]),
          dataRow(['GET', '/api/dashboard/summary/{userId}', 'Get financial summary', '200 OK + {totalIncome, totalExpense, balance}'], [1560, 3120, 2340, 2340], 'F8FBFF'),
        ]
      }),
      spacer(),
      pageBreak(),

      // ── 5. FRONTEND PAGES ─────────────────────────────────────────────────
      heading1('5. Frontend Pages'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 3510, 3510],
        rows: [
          headerRow(['Page', 'File', 'Features'], [2340, 3510, 3510]),
          dataRow(['Dashboard', 'dashboard.html', 'Summary cards, recent income/expense lists, user filter'], [2340, 3510, 3510], 'F8FBFF'),
          dataRow(['Users',     'user.html',      'Add/Edit/Delete users, user table'], [2340, 3510, 3510]),
          dataRow(['Income',    'income.html',    'Add/Delete income, filter by user, total row'], [2340, 3510, 3510], 'F8FBFF'),
          dataRow(['Expense',   'expense.html',   'Add/Delete expense, filter by user, total row'], [2340, 3510, 3510]),
        ]
      }),
      spacer(),
      pageBreak(),

      // ── 6. POSTMAN TEST CASES ─────────────────────────────────────────────
      heading1('6. Postman Test Cases  (Step 13)'),

      heading2('6.1 User Module'),
      numbered('POST  http://localhost:8080/api/users  — Body: {"name":"Santhosh","email":"s@test.com"}  — Expected: 200 + user object'),
      numbered('GET   http://localhost:8080/api/users  — Expected: 200 + array of users'),
      numbered('GET   http://localhost:8080/api/users/1  — Expected: 200 + single user'),
      numbered('PUT   http://localhost:8080/api/users/1  — Body: {"name":"Santhosh K","email":"s@test.com"}  — Expected: 200 + updated user'),
      numbered('DELETE http://localhost:8080/api/users/1  — Expected: 200 + "User deleted successfully"'),
      spacer(),

      heading2('6.2 Income Module'),
      numbered('POST  http://localhost:8080/api/incomes/1  — Body: {"source":"Salary","amount":25000,"date":"2025-06-01"}  — Expected: 200 + income object'),
      numbered('GET   http://localhost:8080/api/incomes  — Expected: 200 + all incomes'),
      numbered('GET   http://localhost:8080/api/incomes/user/1  — Expected: 200 + incomes for user 1'),
      numbered('DELETE http://localhost:8080/api/incomes/1  — Expected: 200 + "Income deleted successfully"'),
      spacer(),

      heading2('6.3 Expense Module'),
      numbered('POST  http://localhost:8080/api/expenses/1  — Body: {"category":"Food","amount":3000,"date":"2025-06-02"}  — Expected: 200 + expense object'),
      numbered('GET   http://localhost:8080/api/expenses  — Expected: 200 + all expenses'),
      numbered('GET   http://localhost:8080/api/expenses/user/1  — Expected: 200 + expenses for user 1'),
      numbered('DELETE http://localhost:8080/api/expenses/1  — Expected: 200 + "Expense deleted successfully"'),
      spacer(),

      heading2('6.4 Dashboard'),
      numbered('GET   http://localhost:8080/api/dashboard/summary/1  — Expected: 200 + {"totalIncome":25000,"totalExpense":3000,"balance":22000}'),
      spacer(),
      pageBreak(),

      // ── 7. SETUP GUIDE ────────────────────────────────────────────────────
      heading1('7. Setup & Run Guide'),

      heading2('7.1 Prerequisites'),
      bullet('Java 17+  (java -version to verify)'),
      bullet('MySQL 8+  (running on port 3306)'),
      bullet('Maven 3.8+  (mvn -version to verify)'),
      bullet('Any modern browser (Chrome recommended)'),
      spacer(),

      heading2('7.2 Database Setup'),
      numbered('Open MySQL Workbench or terminal'),
      numbered('Run the file:  finance-tracker/sql/schema.sql'),
      numbered('Verify tables are created: users, income, expense'),
      spacer(),

      heading2('7.3 Backend Setup'),
      numbered('Open  finance-tracker/backend/src/main/resources/application.properties'),
      numbered('Update spring.datasource.password to your MySQL password'),
      numbered('Navigate to the backend folder in terminal'),
      numbered('Run:  mvn spring-boot:run'),
      numbered('Verify: http://localhost:8080/api/users  returns  []'),
      spacer(),

      heading2('7.4 Frontend Setup'),
      numbered('Navigate to  finance-tracker/frontend/'),
      numbered('Open dashboard.html directly in Chrome'),
      numbered('No server required — uses Fetch API to call localhost:8080'),
      spacer(),
      pageBreak(),

      // ── 8. PROJECT FILE LIST ──────────────────────────────────────────────
      heading1('8. Complete File List'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          headerRow(['File Path', 'Description'], [4680, 4680]),
          dataRow(['sql/schema.sql', 'MySQL CREATE TABLE + sample data'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/pom.xml', 'Maven dependencies'], [4680, 4680]),
          dataRow(['backend/.../application.properties', 'DB & server config'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../FinanceTrackerApplication.java', 'Spring Boot main class'], [4680, 4680]),
          dataRow(['backend/.../entity/User.java', 'User JPA entity'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../entity/Income.java', 'Income JPA entity'], [4680, 4680]),
          dataRow(['backend/.../entity/Expense.java', 'Expense JPA entity'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../repository/UserRepository.java', 'User data access'], [4680, 4680]),
          dataRow(['backend/.../repository/IncomeRepository.java', 'Income data access + sum query'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../repository/ExpenseRepository.java', 'Expense data access + sum query'], [4680, 4680]),
          dataRow(['backend/.../service/UserService.java', 'User business logic'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../service/IncomeService.java', 'Income business logic'], [4680, 4680]),
          dataRow(['backend/.../service/ExpenseService.java', 'Expense business logic'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../controller/UserController.java', 'User REST APIs'], [4680, 4680]),
          dataRow(['backend/.../controller/IncomeController.java', 'Income REST APIs'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../controller/ExpenseController.java', 'Expense REST APIs'], [4680, 4680]),
          dataRow(['backend/.../controller/DashboardController.java', 'Summary calculation API'], [4680, 4680], 'F8FBFF'),
          dataRow(['backend/.../config/CorsConfig.java', 'CORS configuration'], [4680, 4680]),
          dataRow(['frontend/dashboard.html', 'Dashboard with summary cards'], [4680, 4680], 'F8FBFF'),
          dataRow(['frontend/user.html', 'User management page'], [4680, 4680]),
          dataRow(['frontend/income.html', 'Income management page'], [4680, 4680], 'F8FBFF'),
          dataRow(['frontend/expense.html', 'Expense management page'], [4680, 4680]),
        ]
      }),
      spacer(),
      pageBreak(),

      // ── 9. CONCLUSION ─────────────────────────────────────────────────────
      heading1('9. Conclusion'),
      para('The Personal Finance Tracker project successfully demonstrates a complete full-stack web application using Java Spring Boot and MySQL on the backend, with plain HTML, CSS, and JavaScript on the frontend. The application covers all required CRUD operations across three entities and provides a meaningful financial dashboard — making it a practical and educational internship project.'),
      spacer(),
      para('Key learning outcomes from this project:', { bold: true }),
      bullet('Spring Boot REST API development with layered architecture (Entity → Repository → Service → Controller)'),
      bullet('JPA/Hibernate entity relationships with @ManyToOne and @JoinColumn'),
      bullet('Custom JPQL queries for aggregate functions (SUM with COALESCE)'),
      bullet('Frontend-backend integration using JavaScript Fetch API'),
      bullet('MySQL schema design with foreign keys and ON DELETE CASCADE'),
      bullet('CORS configuration for cross-origin frontend requests'),
      spacer(),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/mnt/user-data/outputs/Personal_Finance_Tracker_Documentation.docx', buffer);
  console.log('Documentation generated successfully.');
});
