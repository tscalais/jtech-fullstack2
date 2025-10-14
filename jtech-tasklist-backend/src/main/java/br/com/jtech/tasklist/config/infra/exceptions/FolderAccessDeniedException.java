package br.com.jtech.tasklist.config.infra.exceptions;

public class FolderAccessDeniedException extends RuntimeException {
    public FolderAccessDeniedException(String message) {
        super(message);
    }
}

