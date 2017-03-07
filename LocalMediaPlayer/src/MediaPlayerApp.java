import java.io.File;
import java.io.IOException;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.LineEvent;
import javax.sound.sampled.LineListener;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

import java.net.URI;
import java.net.URISyntaxException;

import javafx.application.*;
import javafx.beans.value.*;
import javafx.collections.*;
import javafx.event.*;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.MapValueFactory;
import javafx.scene.image.*;
import javafx.scene.layout.*;
import javafx.scene.media.*;
import javafx.stage.Stage;
import javafx.util.Callback;
import javafx.util.Duration;

import java.io.File;
import java.io.FilenameFilter;
import java.util.*;

public class MediaPlayerApp extends Application{
	boolean playCompleted;

	private JFrame mainFrame;
	private JLabel headerLabel;
	private JLabel currentlyPlayingLabel;
	private JPanel controlPanel;

    static WebSocketClientEndpoint clientEndpoint;
    
    private static Application initialized;
    
    private MediaPlayer mediaPlayer;

	void play(String audioFilePath){
		if(mediaPlayer != null){
			mediaPlayer.stop();
			mediaPlayer = null;
		}
		final Media media = new Media(new File(audioFilePath).toURI().toString());
		mediaPlayer = new MediaPlayer(media);
		mediaPlayer.setOnError(new Runnable() {
		      public void run() {
		          System.out.println("Media error occurred: " + mediaPlayer.getError());
		        }
		      });
		mediaPlayer.setOnEndOfMedia(new Runnable(){
			public void run(){
				clientEndpoint.sendMessage("next-song");
			}
		});
		mediaPlayer.play();
		//		File audioFile = new File(audioFilePath);
//
//		try{
//			AudioInputStream audioStream = AudioSystem.getAudioInputStream(audioFile);
//			AudioFormat format = audioStream.getFormat();
//			DataLine.Info info = new DataLine.Info(Clip.class, format);
//			Clip audioClip = (Clip)AudioSystem.getLine(info);
//			audioClip.addLineListener(this);
//			audioClip.start();
//
//			while(!playCompleted){
//				//wait for playback to complete
//				try{
//					Thread.sleep(1000);
//				} catch (InterruptedException e){
//					e.printStackTrace();
//				}
//			}
//			audioClip.close();
//		} catch (UnsupportedAudioFileException ex) {
//            System.out.println("The specified audio file is not supported.");
//            ex.printStackTrace();
//        } catch (LineUnavailableException ex) {
//            System.out.println("Audio line for playing back is unavailable.");
//            ex.printStackTrace();
//        } catch (IOException ex) {
//            System.out.println("Error playing the audio file.");
//            ex.printStackTrace();
//        }
	}

	/**
     * Listens to the START and STOP events of the audio line.
     */
  
//    public void update(LineEvent event) {
//        LineEvent.Type type = event.getType();
//         
//        if (type == LineEvent.Type.START) {
//            System.out.println("Playback started.");
//             
//        } else if (type == LineEvent.Type.STOP) {
//            playCompleted = true;
//            System.out.println("Playback completed.");
//            //TODO: ask for new song
//        }
// 
//    }

    public void MediaPlayerWindow(){
    	prepareGUI();
    }

    private void prepareGUI(){
    	mainFrame = new JFrame("Local Music DJ");
    	mainFrame.setSize(400,400);
    	mainFrame.setLayout(new GridLayout(3, 1));
    	headerLabel = new JLabel("Local Music DJ", JLabel.CENTER);
    	headerLabel.setSize(350, 50);
    	currentlyPlayingLabel = new JLabel("", JLabel.CENTER);
    	currentlyPlayingLabel.setSize(350,50);

    	mainFrame.addWindowListener(new WindowAdapter(){
    		public void windowClosing(WindowEvent windowEvent){
    			System.exit(0);
    		}
    	});
    	controlPanel = new JPanel();
    	controlPanel.setLayout(new FlowLayout());

    	mainFrame.add(headerLabel);
    	mainFrame.add(currentlyPlayingLabel);
    	mainFrame.add(controlPanel);
    	mainFrame.setVisible(true);
    }

    public static void main(String[] args){
//    	final MediaPlayerApp mediaPlayer = new MediaPlayerApp();
//    	mediaPlayer.MediaPlayerWindow();
    	Application.launch(MediaPlayerApp.class, args);
//    	try {
//    		clientEndpoint = new WebSocketClientEndpoint(new URI("ws://10.0.0.25:8080/mediaplayer"));
//    		
//    		//addlistener
//    		clientEndpoint.addMessageHandler(new WebSocketClientEndpoint.MessageHandler(){
//    			public void handleMessage(String message){
//    				System.out.println(message);
//    				mediaPlayer.play(message);
//    			}
//    		});
//    		// send message to websocket
//            //clientEndPoint.sendMessage("{'event':'addChannel','channel':'ok_btccny_ticker'}");
//    	} catch(URISyntaxException e){
//    		System.err.println("URISyntaxException exception: " + e.getMessage());
//    	}
	}

	@Override
	public void start(Stage primaryStage) throws Exception {
		System.out.println("jfxInitialized!");
		final MediaPlayerApp mediaPlayer = new MediaPlayerApp();
    	mediaPlayer.MediaPlayerWindow();
    	
    	try {
    		clientEndpoint = new WebSocketClientEndpoint(new URI("ws://10.0.0.25:8080/mediaplayer"));
    		
    		//addlistener
    		clientEndpoint.addMessageHandler(new WebSocketClientEndpoint.MessageHandler(){
    			public void handleMessage(String message){
    				System.out.println(message);
    				mediaPlayer.play(message);
    			}
    		});
    		// send message to websocket
            //clientEndPoint.sendMessage("{'event':'addChannel','channel':'ok_btccny_ticker'}");
    	} catch(URISyntaxException e){
    		System.err.println("URISyntaxException exception: " + e.getMessage());
    	}
    	
		clientEndpoint.sendMessage("next-song");
	}
}