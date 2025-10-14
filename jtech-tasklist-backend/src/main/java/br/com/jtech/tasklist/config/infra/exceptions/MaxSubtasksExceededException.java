package br.com.jtech.tasklist.config.infra.exceptions;

public class MaxSubtasksExceededException extends RuntimeException {
    public MaxSubtasksExceededException() {
        super("Uma tarefa pode ter no máximo 5 subtarefas.");
    }
    public MaxSubtasksExceededException(String message) {
        super(message);
    }
}
