import { inject, injectable } from 'inversify';

import type { DataSource } from 'typeorm';
import type { FileStorageService, IdentityProviderService, NotifierService } from '..';
import { GenericErrorsEnum, ServiceUnavailableError } from '../../errors';
import type { SqlProvider } from '../storage/sql-connection.provider';
import SHARED_SYMBOLS from '../symbols';
import { DomainInnovationsService } from './domain-innovations.service';
import { DomainUsersService } from './domain-users.service';

@injectable()
export class DomainService {
  _users: DomainUsersService;
  get users(): DomainUsersService {
    if (!this._users) {
      throw new ServiceUnavailableError(GenericErrorsEnum.SERVICE_SQL_UNAVAILABLE, {
        message: 'SQL Connection is not initialized'
      });
    }
    return this._users;
  }
  _innovations: DomainInnovationsService;
  get innovations(): DomainInnovationsService {
    if (!this._innovations) {
      throw new ServiceUnavailableError(GenericErrorsEnum.SERVICE_SQL_UNAVAILABLE, {
        message: 'SQL Connection is not initialized'
      });
    }
    return this._innovations;
  }

  constructor(
    @inject(SHARED_SYMBOLS.IdentityProviderService)
    private identityProviderService: IdentityProviderService,
    @inject(SHARED_SYMBOLS.FileStorageService) private fileStorageService: FileStorageService,
    @inject(SHARED_SYMBOLS.SqlProvider) public sqlProvider: SqlProvider,
    @inject(SHARED_SYMBOLS.NotifierService)
    private notifierService: NotifierService
  ) {}

  setConnection(connection: DataSource): void {
    this._innovations = new DomainInnovationsService(
      connection,
      this.fileStorageService,
      this.identityProviderService,
      this.notifierService
    );
    this._users = new DomainUsersService(
      connection,
      this.identityProviderService,
      this._innovations,
      this.notifierService
    );
  }
}
