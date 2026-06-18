package com.finance.tracker.controller;

import com.finance.tracker.entity.Expense;
import com.finance.tracker.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // GET /api/expenses
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    // GET /api/expenses/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(expenseService.getExpensesByUser(userId));
    }

    // POST /api/expenses/{userId}
    @PostMapping("/{userId}")
    public ResponseEntity<Expense> createExpense(@PathVariable Integer userId,
                                                 @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.createExpense(userId, expense));
    }

    // DELETE /api/expenses/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Integer id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok("Expense deleted successfully");
    }
}
