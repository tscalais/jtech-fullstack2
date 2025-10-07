package br.com.jtech.tasklist.controller;

public class TaskStatusRequest {
    private boolean completed;
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
