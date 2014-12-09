package com.xekm.mmo.server;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;

/**
 * Created by mike on 12/8/14.
 */
public class App {
    public static void main(String[] args) throws InterruptedException {
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(9092);

        final SocketIOServer server = new SocketIOServer(config);
        server.addEventListener("locationevent", LocationObject.class, new DataListener<LocationObject>() {
            @Override
            public void onData(SocketIOClient client, LocationObject data, AckRequest ackRequest) {
                // broadcast messages to all clients
                //server.getBroadcastOperations().sendEvent("chatevent", data);
                System.out.println(data);
            }
        });

        server.start();

        Thread.sleep(Integer.MAX_VALUE);

        server.stop();
    }
}
