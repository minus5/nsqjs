import { ConnectionConfig, ReaderConfig } from '../src/config'

describe('ConnectionConfig', () => {
  let config = null

  beforeEach(() => {
    config = new ConnectionConfig()
  })

  it('should use all defaults if nothing is provided', () => {
    config.maxInFlight.should.eql(1)
  })

  it('should validate with defaults', () => {
    const check = () => config.validate()
    check.should.not.throw()
  })

  it('should remove an unrecognized option', () => {
    config = new ConnectionConfig({ unknownOption: 20 })
    config.should.not.have.property('unknownOption')
  })

  describe('isNonEmptyString', () => {
    it('should correctly validate a non-empty string', () => {
      const check = () => config.isNonEmptyString('name', 'worker')
      check.should.not.throw()
    })

    it('should throw on an empty string', () => {
      const check = () => config.isNonEmptyString('name', '')
      check.should.throw()
    })

    it('should throw on a non-string', () => {
      const check = () => config.isNonEmptyString('name', {})
      check.should.throw()
    })
  })

  describe('isNumber', () => {
    it('should validate with a value equal to the lower bound', () => {
      const check = () => config.isNumber('maxInFlight', 1, 1)
      check.should.not.throw()
    })

    it('should validate with a value between the lower and upper bound', () => {
      const check = () => config.isNumber('maxInFlight', 5, 1, 10)
      check.should.not.throw()
    })

    it('should validate with a value equal to the upper bound', () => {
      const check = () => config.isNumber('maxInFlight', 10, 1, 10)
      check.should.not.throw()
    })

    it('should not validate with a value less than the lower bound', () => {
      const check = () => config.isNumber('maxInFlight', -1, 1)
      check.should.throw()
    })

    it('should not validate with a value greater than the upper bound', () => {
      const check = () => config.isNumber('maxInFlight', 11, 1, 10)
      check.should.throw()
    })

    it('should not validate against a non-number', () => {
      const check = () => config.isNumber('maxInFlight', null, 0)
      check.should.throw()
    })
  })

  describe('isNumberExclusive', () => {
    it('should not validate with a value equal to the lower bound', () => {
      const check = () => config.isNumberExclusive('maxInFlight', 1, 1)
      check.should.throw()
    })

    it('should validate with a value between the lower and upper bound', () => {
      const check = () => config.isNumberExclusive('maxInFlight', 5, 1, 10)
      check.should.not.throw()
    })

    it('should not validate with a value equal to the upper bound', () => {
      const check = () => config.isNumberExclusive('maxInFlight', 10, 1, 10)
      check.should.throw()
    })

    it('should not validate with a value less than the lower bound', () => {
      const check = () => config.isNumberExclusive('maxInFlight', -1, 1)
      check.should.throw()
    })

    it('should not validate with a value greater than the upper bound', () => {
      const check = () => config.isNumberExclusive('maxInFlight', 11, 1, 10)
      check.should.throw()
    })

    it('should not validate against a non-number', () => {
      const check = () => config.isNumberExclusive('maxInFlight', null, 0)
      check.should.throw()
    })
  })

  describe('isBoolean', () => {
    it('should validate against true', () => {
      const check = () => config.isBoolean('tls', true)
      check.should.not.throw()
    })

    it('should validate against false', () => {
      const check = () => config.isBoolean('tls', false)
      check.should.not.throw()
    })

    it('should not validate against null', () => {
      const check = () => config.isBoolean('tls', null)
      check.should.throw()
    })

    it('should not validate against a non-boolean value', () => {
      const check = () => config.isBoolean('tls', 'hi')
      check.should.throw()
    })
  })

  describe('isBareAddresses', () => {
    it('should validate against a validate address list of 1', () => {
      const check = () => config.isBareAddresses('nsqdTCPAddresses', ['127.0.0.1:4150'])
      check.should.not.throw()
    })

    it('should validate against a validate address list of 2', () => {
      const check = function () {
        const addrs = ['127.0.0.1:4150', 'localhost:4150']
        config.isBareAddresses('nsqdTCPAddresses', addrs)
      }
      check.should.not.throw()
    })

    it('should not validate non-numeric port', () => {
      const check = () => config.isBareAddresses('nsqdTCPAddresses', ['localhost'])
      check.should.throw()
    })
  })

  describe('isLookupdHTTPAddresses', () => {
    it('should validate against a validate address list of 1', () => {
      const check = () => config.isLookupdHTTPAddresses('lookupdHTTPAddresses', ['127.0.0.1:4150'])
      check.should.not.throw()
    })

    it('should validate against a validate address list of 2', () => {
      const check = () => {
        const addrs = [
          '127.0.0.1:4150',
          'localhost:4150',
          'http://localhost/nsq/lookup',
          'https://localhost/nsq/lookup'
        ]
        config.isLookupdHTTPAddresses('lookupdHTTPAddresses', addrs)
      }
      check.should.not.throw()
    })

    it('should not validate non-numeric port', () => {
      const check = () => config.isLookupdHTTPAddresses('lookupdHTTPAddresses', ['localhost'])
      check.should.throw()
    })

    it('should not validate non-HTTP/HTTPs address', () => {
      const check = () => config.isLookupdHTTPAddresses('lookupdHTTPAddresses', ['localhost'])
      check.should.throw()
    })
  })
})

describe('ReaderConfig', () => {
  let config = null

  beforeEach(() => {
    config = new ReaderConfig()
  })

  it('should use all defaults if nothing is provided', () => {
    config.maxInFlight.should.eql(1)
  })

  it('should validate with defaults', () => {
    const check = function () {
      config = new ReaderConfig({ nsqdTCPAddresses: ['127.0.0.1:4150'] })
      config.validate()
    }
    check.should.not.throw()
  })

  it('should convert a string address to an array', () => {
    config = new ReaderConfig({ lookupdHTTPAddresses: '127.0.0.1:4161' })
    config.validate()
    config.lookupdHTTPAddresses.length.should.equal(1)
  })
})