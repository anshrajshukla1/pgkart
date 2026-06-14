package com.pgkart;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.flyway.enabled=false",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "razorpay.key.id=test",
    "razorpay.key.secret=test",
    "cloudinary.cloud.name=test",
    "cloudinary.api.key=test",
    "cloudinary.api.secret=test",
    "spring.mail.host=localhost"
})
class PgKartApplicationTests {

    @Test
    void contextLoads() {
    }
}
