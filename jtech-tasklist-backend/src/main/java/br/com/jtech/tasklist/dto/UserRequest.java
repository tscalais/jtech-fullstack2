package br.com.jtech.tasklist.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserRequest implements Serializable {
    private String userName;
    private String password;
    private String fullName;
    private Boolean criarExemplo = true;
}
