package com.finance.tracker.service;

import com.finance.tracker.entity.Expense;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository    userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository    = userRepository;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByUser(Integer userId) {
        return expenseRepository.findByUserId(userId);
    }

    public Expense getExpenseById(Integer id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    public Expense createExpense(Integer userId, Expense expense) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Integer id) {
        getExpenseById(id); // validates existence
        expenseRepository.deleteById(id);
    }

    public BigDecimal getTotalExpenseByUser(Integer userId) {
        return expenseRepository.sumAmountByUserId(userId);
    }
}
