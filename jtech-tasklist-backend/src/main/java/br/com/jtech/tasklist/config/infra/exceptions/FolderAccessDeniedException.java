package br.com.jtech.tasklist.config.infra.exceptions;

public class FolderAccessDeniedException extends RuntimeException {
    public FolderAccessDeniedException() {
        super("Acesso negado à pasta");
    }
    public FolderAccessDeniedException(String message) {
        super(message);
    }
}
