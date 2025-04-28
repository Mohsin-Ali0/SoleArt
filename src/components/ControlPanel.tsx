// ControlPanel.js
const ControlPanel = () => {
    const { sendCommand } = useBle();
  
    return (
      <View>
        <Button
          title="Start Conditioning"
          onPress={() => sendCommand(COMMANDS.START_CONDITIONING)}
        />
        <Button
          title="Begin Freeze Drying"
          onPress={() => sendCommand(COMMANDS.START_DRYING)}
        />
        <Button
          title="Abort Cycle"
          color="red"
          onPress={() => sendCommand(COMMANDS.ABORT_CYCLE)}
        />
      </View>
    );
  };