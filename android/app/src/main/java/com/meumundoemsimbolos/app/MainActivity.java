package com.meumundoemsimbolos.app;

import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MeuMundoApp";
    private boolean loadFailed = false;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "App iniciando...");
        
        // Configurar WebView para depuração
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Configurar WebViewClient para detectar erros de carregamento
        bridge.getWebView().setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Log.e(TAG, "Erro ao carregar WebView: " + description);
                loadFailed = true;
                
                // Carregar página de fallback
                view.loadUrl("file:///android_asset/public/fallback.html");
            }
        });
    }
    
    @Override
    public void onStart() {
        super.onStart();
        Log.d(TAG, "App iniciado");
    }
    
    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "App em primeiro plano");
        
        // Se o carregamento falhou anteriormente, tentar novamente
        if (loadFailed) {
            bridge.getWebView().reload();
            loadFailed = false;
        }
    }
}
