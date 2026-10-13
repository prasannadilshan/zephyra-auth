package com.zephyra.auth.security.xss;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class XssRequestWrapper extends HttpServletRequestWrapper {

    public XssRequestWrapper(HttpServletRequest request) {
        super(request);
    }

    @Override
    public String[] getParameterValues(String parameter) {
        String[] values = super.getParameterValues(parameter);
        if (values == null) {
            return null;
        }
        int count = values.length;
        String[] encodedValues = new String[count];
        for (int i = 0; i < count; i++) {
            encodedValues[i] = XssSanitizer.sanitize(values[i]);
        }
        return encodedValues;
    }

    @Override
    public String getParameter(String parameter) {
        String value = super.getParameter(parameter);
        return XssSanitizer.sanitize(value);
    }

    @Override
    public String getHeader(String name) {
        String value = super.getHeader(name);
        return XssSanitizer.sanitize(value);
    }

    @Override
    public Map<String, String[]> getParameterMap() {
        Map<String, String[]> originalMap = super.getParameterMap();
        Map<String, String[]> sanitizedMap = new HashMap<>();
        for (Map.Entry<String, String[]> entry : originalMap.entrySet()) {
            String[] originalValues = entry.getValue();
            if (originalValues != null) {
                String[] sanitizedValues = new String[originalValues.length];
                for (int i = 0; i < originalValues.length; i++) {
                    sanitizedValues[i] = XssSanitizer.sanitize(originalValues[i]);
                }
                sanitizedMap.put(entry.getKey(), sanitizedValues);
            }
        }
        return Collections.unmodifiableMap(sanitizedMap);
    }
}
