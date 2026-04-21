package com.urbanhelp.urbanhelp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urbanhelp.urbanhelp.model.usu;

@RestController
@RequestMapping("/api/users")
public class userController {
    @GetMapping("/{id}")
    public usu getUserById(@PathVariable int id) {
        // Implementation for fetching user by ID
        return null;
    }

    @GetMapping
    public List<usu> getAllUsers() {
        // Implementation for fetching all users
        return null;
    }

    @PostMapping
    public usu createUser(@RequestBody usu user) {
        // Implementation for creating a new user
        return null;
    }

    @PutMapping("/{id}")
    public usu deactivateUser(@PathVariable int id) {
        // Implementation for deactivating user account
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        // Implementation for deleting user account
    }
}
