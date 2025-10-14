package br.com.jtech.tasklist.config.infra.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException() {
        super("Usuário não encontrado");
    }
    public UserNotFoundException(String message) {
        super(message);
    }
}
