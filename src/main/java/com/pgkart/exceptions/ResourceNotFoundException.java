package com.pgkart.exceptions;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue));
    }

    public ResourceNotFoundException(String resourceName, Long id, String field) {
        super(String.format("%s not found with %s: %d", resourceName, field, id));
    }
}
