package br.com.jtech.tasklist.config.infra.exceptions;

public class TaskNotInFolderException extends RuntimeException {
    public TaskNotInFolderException() {
        super("A tarefa não pertence a esta pasta");
    }
    public TaskNotInFolderException(String message) {
        super(message);
    }
}
