package com.finance.tracker.service;

import com.finance.tracker.entity.Income;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository   userRepository;

    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.userRepository   = userRepository;
    }

    public List<Income> getAllIncomes() {
        return incomeRepository.findAll();
    }

    public List<Income> getIncomesByUser(Integer userId) {
        return incomeRepository.findByUserId(userId);
    }

    public Income getIncomeById(Integer id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));
    }

    public Income createIncome(Integer userId, Income income) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        income.setUser(user);
        return incomeRepository.save(income);
    }

    public void deleteIncome(Integer id) {
        getIncomeById(id); // validates existence
        incomeRepository.deleteById(id);
    }

    public BigDecimal getTotalIncomeByUser(Integer userId) {
        return incomeRepository.sumAmountByUserId(userId);
    }
}
