export class ServerServiceMock {
  public connect() {
    return true;
  }

  public search() { }

  public leaveChannel() { }

  public disconnect() {
    return true;
  }
}
