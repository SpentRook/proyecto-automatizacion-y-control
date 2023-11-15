#include <PID_v1.h> // Library for PID
#include <Wire.h> // Library for I2C Communication
#include <DHT.h> // Library for DHT

#define DHTTYPE DHT11 // DHT11 TYPE

const int moistureLevelPin = A1;  // Pin of the moisture sensor
const int DHTpin = 2;       // Pin of the DHT11 sensor
const int LEDS = 3;         // Pin with PWM for leds
const int PHOTOR = A0;       // Pin A0 for photo resistor
const int PUMP = 4;         // Pin of the pump

int photoValue;             // Light level detected by the photo resistor
char stringNumber[6] = {0}; // Values in char for the I2C bytes communication

DHT dht(DHTpin, DHTTYPE);   // DHT Object
// Tuning parameters
float Kp = 0;              // Proportional gain
float Ki = 5;             // Integral gain
float Kd = 0;              // Differential gain

// Record the set point as well as the controller input and output
double Setpoint, Input, Output;
// Create a controller that is linked to the specified Input, Ouput and Setpoint
PID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, DIRECT);

const int sampleRate = 1;        // Time interval of the PID control
const long serialPing = 500;     // How often data is recieved from the Arduino
unsigned long now = 0;           // Store the time that has elapsed
unsigned long lastMessage = 0;   // The last time that data was recieved

long lastSoilMestiureRecorded = 0; // Last time soil moisture was recorded
long intervalToRecordSoilMestiure = 1000; // Interval to record the soil moisture 

long lastTemperatureRecorded = 0; // Last time temperature was recorded
long intervalToRecordTemperature = 5000; // Interval to record the temperature

bool isServerReady = false; // flag to check if the server has sent the setpoints

// Max light recorded from the led matrix
int maxLedLux = 40;

// the data gathered by sensors
struct parameters{
  float temperature;
  float luxes;
  float soilMestiurePercentage;
};

parameters setPoints {
  15,
  800,
  0
};

parameters currentValues {
  0,
  0,
  0
};

// Helpers for I2C communication
void castFloatToCharArray(float number){
  dtostrf(number, 6, 1, stringNumber);
}

int castCharArrayToFloat(String value){
  return value.toFloat();
}

// Event handler for the "onReceive" event
void getSetPoints(int _counter){

  String string, stringTemperature, stringLuxes, stringSoilMoisture;

  do{
    char c = Wire.read();
    string = string + c; // Concatenate char by char

    stringTemperature = string.substring(0, 6); //Split the substring of temperature
    stringLuxes = string.substring(7, 13);      //Split the substring of luxes
    stringSoilMoisture = string.substring(14);  //Split the substring of soil moisture
  }while(Wire.available()); // Check if the master is sending data

  // Update setpoints parameters casting from char array to float
  setPoints.temperature = castCharArrayToFloat(stringTemperature);
  setPoints.luxes = castCharArrayToFloat(stringLuxes);
  setPoints.soilMestiurePercentage = castCharArrayToFloat(stringSoilMoisture);

  Serial.println("temperature setpoint: " + String(setPoints.temperature));
  Serial.println("light setpoint: " + String(setPoints.luxes));
  Serial.println("soil moisture setpoint: " + String(setPoints.soilMestiurePercentage));

  isServerReady = true;
  Setpoint = map(setPoints.luxes, 0, 1000, 0, 255); // Saves the setpoint into the PID object and map the data to byte (The PID object works with 0 - 255 values)
}

// Event handler for the "onRequest" event
void sendData(){
  // Send the data as char array
  castFloatToCharArray(currentValues.temperature);
  Wire.write(stringNumber);
  Wire.write(",");
  castFloatToCharArray(currentValues.luxes);
  Wire.write(stringNumber);
  Wire.write(",");
  castFloatToCharArray(currentValues.soilMestiurePercentage);
  Wire.write(stringNumber);
}

void setup() {
  Serial.println("Starting controller");

  // Setup pin modes
  pinMode(PUMP, OUTPUT);
  pinMode(LEDS, OUTPUT);

  // Power off the PUMP (NC Reley)
  digitalWrite(PUMP, HIGH);

  Serial.begin(9600);

  photoValue = analogRead(PHOTOR);

  // Cast PHOTOR value to luxes
  int luxFromPhotoV= map(photoValue, 0, maxLedLux, 0, 1000);

  // Lux to bits
  Input = map(photoValue, 0, maxLedLux, 0, 255);

  // Setpoint in bits
  Setpoint = map(setPoints.luxes, 0, 1000, 0, 255);

  myPID.SetMode(AUTOMATIC); // Update the output using the initial parameters to find best adjust
  myPID.SetSampleTime(sampleRate); // Interval to refresh and update

  Serial.println("****Begin PID setup****");

  lastMessage = millis();

  Wire.begin(9); // Start communication with master in channel 9
  Wire.onReceive(getSetPoints); // Subscribe to "onReceive" event
  Wire.onRequest(sendData);     // Subscribe to "onRequest" event

  Serial.print("Getting data from server...");

  dht.begin(); // Begin the DHT sensor
}

void PIDprocess () {
  photoValue = analogRead(PHOTOR);
  int luxFromPhotoV= map(photoValue, 0, maxLedLux, 0, 1000);

  // Lux to bits
  Input = map(photoValue, 0, maxLedLux, 0, 255);

  myPID.Compute();    
  
  analogWrite(LEDS, Output); // Update output of LEDS using the Output given by the PID                     
  now = millis();            

  if(now - lastMessage > serialPing) {
    currentValues.luxes = map(Input, 0, 255, 0, 1000);

    Serial.print("Setpoint = ");
    Serial.print(setPoints.luxes);
    Serial.print(" Input (lux) = ");
    Serial.print(currentValues.luxes);
    Serial.print(" Output = ");
    Serial.print(map(Output, 0, 255, 0, 1000));
    Serial.print("\n");

    // The tuning parameters can be retrieved by the Arduino from the serial monitor: 0,0.5,0 set Ki to 0.5.
    // Commas are ignored by the Serial.parseFloat() command

    if (Serial.available() > 0) {
      for (int x = 0; x < 4; x++) {
        switch(x) {
          case 0:
          Kp = Serial.parseFloat();
          break;
          case 1:
          Ki = Serial.parseFloat();
          break;
          case 2:
          Kd = Serial.parseFloat();
          break;
          case 3:
          for (int y = Serial.available(); y == 0; y--) {
            Serial.read();
          }
          break;
        }
      }
      Serial.print(" Kp,Ki,Kd = ");  // Display the new parameters
      Serial.print(Kp);
      Serial.print(",");
      Serial.print(Ki);
      Serial.print(",");
      Serial.print(Kd);
      myPID.SetTunings(Kp, Ki, Kd);  // Set the tuning of the PID loop
    }
    lastMessage = now;
  }
}

void loop() {

  if(isServerReady == false){ // Check if is required to wait for the setpoints
    Serial.print(".");
    return;
  }

  PIDprocess(); // Apply PID

  unsigned long currentMillis = millis();
  
  int rawSoilMoisture = analogRead(moistureLevelPin);

  // Updates the current values in units required
  currentValues.soilMestiurePercentage = map(rawSoilMoisture, 0, 1023, 100, 0);

  if(currentMillis - lastTemperatureRecorded > intervalToRecordTemperature){
    lastTemperatureRecorded = currentMillis;
    float temperatureInSensor = dht.readTemperature(); // Read the dht sensor for temperature
    if(isnan(temperatureInSensor)){
      Serial.println("Error getting temperature sensor value");
      return;
    }
    currentValues.temperature = temperatureInSensor;
  }

  if(currentMillis - lastSoilMestiureRecorded > intervalToRecordSoilMestiure){
    lastSoilMestiureRecorded = currentMillis;

    // Check if the current percentage is lower or equals to the desired
    if(currentValues.soilMestiurePercentage < setPoints.soilMestiurePercentage){
      digitalWrite(PUMP, LOW); // Turn on the pump
    } else {
      digitalWrite(PUMP, HIGH); // Turn off the pump
    }
  }  
}