package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CognitoTokenResponseDto;
import com.ecommerce.backend.dto.TokenDto;
import com.ecommerce.backend.dto.UrlDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

@RestController
public class AuthenticationController {

    @Value("${auth.cognitoUri}")
    private String cognitoUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.clientId}")
    private String clientId;

    @Value("${spring.security.oauth2.resourceserver.jwt.clientSecret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.resourceserver.jwt.redirect-uri}")
    private String redirectUri;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/api/auth/url")
    public ResponseEntity<UrlDto> url() {

        String url = cognitoUri +
                "/oauth2/authorize?" +
                "response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" +redirectUri +
                "&scope=email+openid+profile";

        return ResponseEntity.ok(new UrlDto(url));
    }


    @GetMapping("/api/auth/callback")
    public ResponseEntity<TokenDto> callback(@RequestParam("code") String code) {

        String urlStr = cognitoUri + "/oauth2/token?" +
                "grant_type=authorization_code" +
                "&client_id=" + clientId +
                "&code=" + code +
                "&redirect_uri="+redirectUri;

        String authenticationInfo = clientId + ":" + clientSecret;
        String basicAuthentication =
                Base64.getEncoder().encodeToString(authenticationInfo.getBytes());

        HttpRequest request;

        try {
            request = HttpRequest.newBuilder(new URI(urlStr))
                    .header("Content-type", "application/x-www-form-urlencoded")
                    .header("Authorization", "Basic " + basicAuthentication)
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();

        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response ;
        try{
            response=client.send(request,HttpResponse.BodyHandlers.ofString());
        }catch (Exception e){
            throw new RuntimeException(e);
        }

        if(response.statusCode() != 200){
            throw new RuntimeException(response.body());
        }

        CognitoTokenResponseDto token= objectMapper.readValue(response.body(),CognitoTokenResponseDto.class);

        return ResponseEntity.ok(new  TokenDto(token.id_token()));
    }
}