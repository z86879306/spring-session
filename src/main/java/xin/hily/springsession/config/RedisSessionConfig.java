package xin.hily.springsession.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
/**
 * Demo class
 *
 * @author ly
 * @date 2018/7/4
 */

@Configuration
@EnableRedisHttpSession
public class RedisSessionConfig {


    @Bean
    public JedisConnectionFactory connectionFactory() {
        return new JedisConnectionFactory();
    }
}

