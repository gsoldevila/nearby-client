import { NearbyPosition } from "../position.service";

export class PositionServiceMock {
  public getCurrentPosition() {
    return Promise.resolve(new NearbyPosition(90, 0, 0, Date.now()));
  }
}
