export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'config' | 'debug' | 'trace'

export interface GeckodriverParameters {
  /**
   * List of hostnames to allow. By default the value of --host is allowed, and in addition if that's a well
   * known local address, other variations on well known local addresses are allowed. If --allow-hosts is
   * provided only exactly those hosts are allowed
   * @default []
   */
  allowHosts?: string[]
  /**
   * List of request origins to allow. These must be formatted as scheme://host:port. By default any request
   * with an origin header is rejected. If --allow-origins is provided then only exactly those origins
   * are allowed.
   * @default []
   */
  allowOrigins?: string[]
  /**
   * Path to the Firefox binary
   */
  binary?: string
  /**
   * Connect to an existing Firefox instance
   * @default false
   */
  connectExisting?: boolean
  /**
   * Host IP to use for WebDriver server
   * @default 127.0.0.1
   */
  host?: string
  /**
   * Attach browser toolbox debugger for Firefox
   * @default false
   */
  jsdebugger?: boolean
  /**
   * Set Gecko log level [possible values: fatal, error, warn, info, config, debug, trace]
   */
  log?: LogLevel
  /**
   * write server log to file instead of stderr, increases log level to INFO
   */
  logNoTruncated?: boolean
  /**
   * Host to use to connect to Gecko
   * @default 127.0.0.1
   */
  marionetteHost?: string
  /**
   * Port to use to connect to Gecko
   * @default 0
   */
  marionettePort?: number
  /**
   * port to listen on
   */
  port?: number
  /**
   * Directory in which to create profiles. Defaults to the system temporary directory.
   */
  profileRoot?: string
  /**
   * Version of Geckodriver to start. See https://github.com/mozilla/geckodriver/releases for all available versions, platforms and architecture.
   */
  geckoDriverVersion?: string
  /**
   * Don't download Geckodriver, instead use a custom path to it, e.g. a cached binary.
   */
  customGeckoDriverPath?: string
}
