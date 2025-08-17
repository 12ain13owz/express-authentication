export enum LogSeverity {
  LOW = 'INFO',
  MEDIUM = 'WARN',
  HIGH = 'ERROR',
  CRITICAL = 'CRIT',
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRIT = 'CRIT',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum Colors {
  STRING = '38;2;241;250;140', // #F1FA8C
  NUMBER = '38;2;127;255;212', // #7FFFD4
  BOOLEAN = '38;2;250;140;208', // #FA8CD0
  DATE = '38;2;0;180;180', // #7FFFD4
  NULL = '38;2;0;64;128', // #004080
  UNDEFINED = '38;2;85;85;85', // #555555
  FIELD = '38;2;121;192;255', // #79C0FF
  FUNCTION = '38;2;210;168;255', // #D2A8FF
  OTHER = '38;2;255;255;255', // #FFFFFF
  INFO = '38;2;52;199;89', // #34C759 (LOW)
  WARN = '38;2;255;149;0', // #FF9500 (MEDIUM)
  ERROR = '38;2;255;59;48', // #FF3B30 (HIGH)
  CRIT = '38;2;175;82;222', // #AF52DE (CRITICAL)
}
