package xin.hily.springsession.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
/**
 * Demo class
 *
 * @author ly
 * @date 2018/7/4
 */
@RestController
public class HelloWorld {

    @RequestMapping("hello")
    @ResponseBody
    public String hello(HttpSession session){
        return "hello";
    }


    @RequestMapping("/uid")
    public String uid(HttpSession session) {
        UUID uid = (UUID) session.getAttribute("uid");
        if (uid == null) {
            uid = UUID.randomUUID();
        }
        session.setAttribute("uid", uid);
        return session.getId();
    }


    @RequestMapping(value = "/first", method = RequestMethod.GET)
    public Map<String, Object> firstResp (HttpServletRequest request){
        Map<String, Object> map = new HashMap<>(16);
        request.getSession().setAttribute("request Url", request.getRequestURL());
        map.put("request Url", request.getRequestURL());
        return map;
    }

    @RequestMapping(value = "/sessions", method = RequestMethod.GET)
    public Object sessions (HttpServletRequest request){
        Map<String, Object> map = new HashMap<>(16);
        map.put("sessionId", request.getSession().getId());
        map.put("message", request.getSession().getAttribute("map"));
        return map;
    }
}
