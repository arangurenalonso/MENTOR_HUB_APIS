class AvailabilityRequestDTO {
  public id?: string | null;
  public idDayOfWeek: string;
  public idStartTime: string;
  public idFinalTime: string;

  constructor(
    idDayOfWeek: string,
    idStartTime: string,
    idFinalTime: string,
    id?: string | null
  ) {
    this.id = id;
    this.idDayOfWeek = idDayOfWeek;
    this.idStartTime = idStartTime;
    this.idFinalTime = idFinalTime;
  }
}
export default AvailabilityRequestDTO;
