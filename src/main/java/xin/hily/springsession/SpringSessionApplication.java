package xin.hily.springsession;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
/**
 * Demo class
 *
 * @author ly
 * @date 2018/7/4
 */
@SpringBootApplication
@EnableRedisHttpSession
public class SpringSessionApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringSessionApplication.class, args);
    }
}
