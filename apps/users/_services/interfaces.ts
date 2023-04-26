import type { AnnouncementsService } from './announcements.service';
import type { NotificationsService } from './notifications.service';
import type { OrganisationsService } from './organisations.service';
import type { StatisticsService } from './statistics.service';
import type { TermsOfUseService } from './terms-of-use.service';
import type { UsersService } from './users.service';


export type OrganisationsServiceType = typeof OrganisationsService.prototype;
export const OrganisationsServiceSymbol = Symbol.for('OrganisationsService');

export type TermsOfUseServiceType = typeof TermsOfUseService.prototype;
export const TermsOfUseServiceSymbol = Symbol.for('TermsOfUseService');

export type UsersServiceType = typeof UsersService.prototype;
export const UsersServiceSymbol = Symbol.for('UsersService');

export type NotificationsServiceType = typeof NotificationsService.prototype;
export const NotificationsServiceSymbol = Symbol.for('NotificationsService');

export type StatisticsServiceType = typeof StatisticsService.prototype;
export const StatisticsServiceSymbol = Symbol.for('StatisticsService');

export type AnnouncementsServiceType = typeof AnnouncementsService.prototype;
export const AnnouncementsServiceSymbol = Symbol.for('AnnouncementsService');
