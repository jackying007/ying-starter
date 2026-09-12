export enum DeviceType {
  Windows = 'windows',
  MacOs = 'mac os',
  Android = 'android',
  Ios = 'ios',
  Others = 'others'
}

export enum PushTaskStatus {
  Wait,
  WaitExecute,
  Executing,
  Done
}

export enum PushRecordStatus {
  Pushing,
  Success,
  Fail
}
