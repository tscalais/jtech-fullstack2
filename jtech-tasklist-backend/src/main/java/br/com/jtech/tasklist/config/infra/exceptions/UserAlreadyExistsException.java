package br.com.jtech.tasklist.config.infra.exceptions;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("Usuário já existe");
    }
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
