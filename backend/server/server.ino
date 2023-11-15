#include <WiFi.h> // Library to connect to Wifi
#include <WebServer.h> // Library to setup an API Rest Server
#include <ArduinoJson.h> // Library to handle JSONs
#include <ThingSpeak.h> // Library for ThingSpeak connection
#include <Wire.h> // Library for I2C communication

char stringNumber[6] = {0}; // Values in char for the I2C bytes communication

const char* ssid = "WIFI NAME"; //Name of WiFi Network to connect
const char* password = "WIFI PASSWORD"; // WiFi Password

unsigned long channelID = 2342485; //ThingSpeak Channel ID
const char * writeAPIKey = "THINGSPEAK API KEY"; // ThingSpeak API Key

bool isServerReady = false; // flag to check if the server already have sent setpoints
long lastTimeDataToDashboardSent = 0; // Last time data to dashboard was sent
long intervalToSendDataToDashboard = 16000; // Interval to send dato to dashboard
long lastTimeDataFromSlaveRequested = 0; // Last time data from sensor was requested
long intervalToRequestDataFromSlave = 12000; // Interval to request sensors data

// the data gathered by sensors
struct parameters{
  float temperature;
  float luxes;
  float soilMestiurePercentage;
};

parameters setPoints {
  18,
  800,
  0
};

parameters currentValues {
  0,
  0,
  0
};

// Web server running on port 8080
WebServer server(8080);


// WiFi Client to connect to ThingSpeak
WiFiClient client;

// JSON data buffer
StaticJsonDocument<250> jsonDocument;
char buffer[250];

// Helpers for I2C communication
void castFloatToCharArray(float number){
  dtostrf(number, 6, 1, stringNumber);
}

int castCharArrayToFloat(String value){
  return value.toFloat();
}

// Function to emmit "request" event on Slaves to gather sensors data
void requestPlantStatus(){
  Serial.println("Requesting current data from Slave...");
  Wire.requestFrom(9, 20); // Publish a request event on channel 9 to receive 20 bytes

  String string, stringTemperature, stringLuxes, stringSoilMoisture;

  do{
    char c = Wire.read();
    string = string + c; // Concatenate char by char

    stringTemperature = string.substring(0, 6); //Split the substring of temperature
    stringLuxes = string.substring(7, 13);      //Split the substring of luxes
    stringSoilMoisture = string.substring(14);  //Split the substring of soil moisture
  }while(Wire.available()); // Check if the slave is sending data

  // Update current values parameters casting from char array to float
  currentValues.temperature = castCharArrayToFloat(stringTemperature);
  currentValues.luxes = castCharArrayToFloat(stringLuxes);
  currentValues.soilMestiurePercentage = castCharArrayToFloat(stringSoilMoisture);
  Serial.println("Data from Slave gathered!");
  Serial.println("*******************************************************");
  Serial.println("Temperature: " + String(currentValues.temperature));
  Serial.println("Light: " + String(currentValues.luxes));
  Serial.println("Soil mestiure lvl: " + String(currentValues.soilMestiurePercentage));
  Serial.println("*******************************************************");
}

// Function to emmit "transmission" event on Slaves to send setpoints
void sendSetPoints(){
  Serial.println("Sending setpoints to Slave...");
  Wire.beginTransmission(9); // Publish a transmission event to slave in channel 9
  castFloatToCharArray(setPoints.temperature);
  Wire.write(stringNumber);
  Wire.write(",");
  castFloatToCharArray(setPoints.luxes);
  Wire.write(stringNumber);
  Wire.write(",");
  castFloatToCharArray(setPoints.soilMestiurePercentage);
  Wire.write(stringNumber);
  Wire.endTransmission(); 
  Serial.println("setpoints to Slave sent!");
}

// Helper to verify if data makes sense
bool isDataClean(){
  bool valuesBelowZero = currentValues.luxes < 0 || currentValues.soilMestiurePercentage < 0 || currentValues.temperature < 0;
  if(valuesBelowZero || isServerReady == false){
    return false;
  }
  return true;
}

// Function to send curren sensor values to dashboard in ThingSpeak
void sendDataToDashboard(){

  if(isDataClean() == false){
    Serial.println("Data is not ready to send to dashboard");
    return;
  }

  // Sets the values for each variable
  ThingSpeak.setField(1, currentValues.luxes);
  ThingSpeak.setField(2, currentValues.soilMestiurePercentage);
  ThingSpeak.setField(3, currentValues.temperature);
  
  // write to the ThingSpeak channel
  int status = ThingSpeak.writeFields(channelID, writeAPIKey);
  if(status == 200){
    Serial.println("Channel update successful.");
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(status));
  }
}

// All the setup config for WiFi connection
void setupWifiConnection() {
  WiFi.begin(ssid,password); //Begin WiFi Connection
  Serial.println("\nConnecting");
  while(WiFi.status() != WL_CONNECTED){ // Wait for a WiFi connection
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected to WiFi");

  Serial.println(WiFi.localIP()); // Print the ip of this device
}

// Data transfer object for (GET) health check endpoint
void healthCheckResponseDTO () { 
  jsonDocument.clear(); // Clean the current buffer of JSON
  jsonDocument["status"] = "ok"; // Create status field in empty JSON object
  serializeJson(jsonDocument, buffer); // Write into the buffer
  Serial.println("Buffer:");
  Serial.println(buffer);  
}

// Data transfer object for (GET) parameters endpoint
void getSetPointsResponseDTO () { 
  jsonDocument.clear(); 
  jsonDocument["soil_mestiure"] = setPoints.soilMestiurePercentage;
  jsonDocument["temperature"] = setPoints.temperature;
  jsonDocument["light_level"] = setPoints.luxes;

  serializeJson(jsonDocument, buffer);
  Serial.println("Buffer:");
  Serial.println(buffer);  
}

// Controller for health endpoint (GET)
void healthController(){
  Serial.println("checking server health...");
  healthCheckResponseDTO();
  server.send(200, "application/json", buffer); //Send the buffer as JSON and a 200 status
}

// Controller for saving setpoints (PUT) 
void setPointsController() {
  if(server.hasArg("plain") == false){ // Check if is not raw the json request 
    Serial.println("Format not supported");
    return;
  }

  String body = server.arg("plain"); // Get the json object
  Serial.println(body);
  deserializeJson(jsonDocument, body); // Transfer the JSON object from body to JsonDocument

  setPoints.soilMestiurePercentage = jsonDocument["soil_mestiure"];
  setPoints.luxes = jsonDocument["light_level"];
  setPoints.temperature = jsonDocument["temperature"];

  Serial.println("\nSetpoints saved");
  Serial.println("Soil mestiure percentage: " + String(setPoints.soilMestiurePercentage) + "\n" + "Luxes: " + String(setPoints.luxes) + "\n" + "Temperature" + String(setPoints.temperature));

  sendSetPoints();

  server.send(200, "application/json", "{}"); //Send the buffer as JSON and a 200 status

  isServerReady = true;
}

// Controller for retuning setpoints (GET) 
void getterSetPointsController(){
  Serial.println("Getting current setpoints");
  getSetPointsResponseDTO();
  server.send(200, "application/json", buffer); // Send the buffer as JSON and a 200 status
}

// setup API resources
void setupRouting() {
  server.on("/verify-health", healthController); // GET endpoint
  server.on("/parameters", HTTP_PUT, setPointsController); // PUT endpoint
  server.on("/parameters", HTTP_GET, getterSetPointsController); // GET endpoint

  server.begin(); // Run the server
}

void setup() {
    Serial.begin(115200);
    setupWifiConnection();
    setupRouting();
    ThingSpeak.begin(client); //Start ThingSpeak communication
    Wire.begin(); // Start I2C communication as Master
    delay(5000);
    sendSetPoints();
    isServerReady = true;
}

void loop() {
  server.handleClient(); // Listening for requests in the API Rest

  if(isServerReady == false){ // Check if the setpoints already have sent
    Serial.print(".");
    return;
  }

  unsigned long currentMillis = millis();
  if(currentMillis - lastTimeDataFromSlaveRequested > intervalToRequestDataFromSlave){
    lastTimeDataFromSlaveRequested = currentMillis;
    requestPlantStatus();
  }

  if(currentMillis - lastTimeDataToDashboardSent > intervalToSendDataToDashboard){
    lastTimeDataToDashboardSent = currentMillis;
    sendDataToDashboard();
  }
}