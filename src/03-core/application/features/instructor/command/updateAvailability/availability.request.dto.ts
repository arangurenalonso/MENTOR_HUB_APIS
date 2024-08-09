class AvailabilityRequestDTO {
  public idDayOfWeek: string;
  public idStartTime: string;
  public idFinalTime: string;

  constructor(idDayOfWeek: string, idStartTime: string, idFinalTime: string) {
    this.idDayOfWeek = idDayOfWeek;
    this.idStartTime = idStartTime;
    this.idFinalTime = idFinalTime;
  }
}
export default AvailabilityRequestDTO;
