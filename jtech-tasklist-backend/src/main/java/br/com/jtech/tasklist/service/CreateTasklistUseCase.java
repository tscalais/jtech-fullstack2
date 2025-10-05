/*
 *  @(#)TasklistUseCase.java
 *
 *  Copyright (c) J-Tech Solucoes em Informatica.
 *  All Rights Reserved.
 *
 *  This software is the confidential and proprietary information of J-Tech.
 *  ("Confidential Information"). You shall not disclose such Confidential
 *  Information and shall use it only in accordance with the terms of the
 *  license agreement you entered into with J-Tech.
 *
 */
package br.com.jtech.tasklist.service;


import br.com.jtech.tasklist.model.Tasklist;
import br.com.jtech.tasklist.repository.TasklistRepository;
import org.springframework.stereotype.Service;

/**
 * class TasklistUseCase
 * <p>
 * user angelo.vicente
 */
@Service
public class CreateTasklistUseCase {
    private final TasklistRepository tasklistRepository;

    public CreateTasklistUseCase(TasklistRepository tasklistRepository) {
        this.tasklistRepository = tasklistRepository;
    }

    public Tasklist create(Tasklist tasklist) {
        return Tasklist.of(tasklistRepository.save(tasklist.toEntity()));
    }
}