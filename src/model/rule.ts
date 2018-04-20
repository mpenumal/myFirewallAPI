interface Rule {
  id: number;
  sourceIP: number;
  destinationIP: number;
  sourcePort: number;
  destinationPort: number;
  type: number;
  packetsPerSecond: number;
  action: Action;
}