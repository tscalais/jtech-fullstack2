package br.com.jtech.tasklist.config.infra.exceptions;

public class FolderNotFoundException extends RuntimeException {
    public FolderNotFoundException() {
        super("Pasta não encontrada");
    }
    public FolderNotFoundException(String message) {
        super(message);
    }
}
