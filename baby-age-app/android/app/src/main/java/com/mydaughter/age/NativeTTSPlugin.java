package com.mydaughter.age;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Locale;

@CapacitorPlugin(name = "NativeTTS")
public class NativeTTSPlugin extends Plugin implements TextToSpeech.OnInitListener {

    private TextToSpeech tts;
    private boolean ttsReady = false;

    @Override
    public void load() {
        tts = new TextToSpeech(getContext(), this);
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            int result = tts.setLanguage(new Locale("he", "IL"));
            ttsReady = (result != TextToSpeech.LANG_MISSING_DATA &&
                        result != TextToSpeech.LANG_NOT_SUPPORTED);
        }
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text  = call.getString("text",  "");
        float  pitch = call.getFloat("pitch",  1.0f);
        float  rate  = call.getFloat("rate",   0.88f);

        if (!ttsReady) {
            call.reject("TTS_NOT_READY");
            return;
        }

        tts.setPitch(pitch);
        tts.setSpeechRate(rate);

        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id) {}
            @Override public void onDone(String id)  { call.resolve(); }
            @Override public void onError(String id) { call.reject("TTS_ERROR"); }
        });

        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "utt_" + System.currentTimeMillis());
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (tts != null) tts.stop();
        call.resolve();
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", ttsReady);
        call.resolve(ret);
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        super.handleOnDestroy();
    }
}
