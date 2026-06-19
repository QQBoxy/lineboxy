import { BadRequestException, Injectable } from '@nestjs/common';

import { TransactionService } from '../../../transaction/transaction.service';
import { UsersService } from '../../../users/users.service';

const CHINESE_DIGITS: Record<string, number> = {
  零: 0,
  一: 1,
  二: 2,
  兩: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

const CHINESE_UNITS: Record<string, number> = {
  十: 10,
  百: 100,
  千: 1000,
};

@Injectable()
export class ExpenseService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly usersService: UsersService,
  ) {}

  async create(text: string, userId: string) {
    const match = text.match(
      /^(?:記帳|記|帳)\s+(.+)\s+([0-9]+|[零〇一二兩三四五六七八九十百千萬]+)$/,
    );
    if (!match) {
      throw new BadRequestException('記帳格式錯誤，請輸入：記帳 名稱 金額');
    }

    const price = this.parsePrice(match[2]);
    if (!Number.isSafeInteger(price) || price <= 0) {
      throw new BadRequestException('金額格式錯誤。');
    }

    const user = await this.usersService.findOneByLineUserId(userId);
    if (!user) {
      throw new BadRequestException('Unknown Line user.');
    }

    return this.transactionService.create({
      name: match[1].trim(),
      price,
      user,
    });
  }

  private parsePrice(priceText: string): number {
    if (/^[0-9]+$/.test(priceText)) {
      return Number(priceText);
    }
    return this.parseChineseNumber(priceText);
  }

  private parseChineseNumber(priceText: string): number {
    const sections = priceText.split('萬');
    if (sections.length > 2) {
      return NaN;
    }

    const high = sections.length === 2 ? this.parseChineseNumberSection(sections[0]) : 0;
    const lowSection = sections[sections.length - 1];
    const low = this.parseChineseNumberSection(lowSection);

    if (!Number.isFinite(high) || !Number.isFinite(low)) {
      return NaN;
    }

    if (sections.length === 2 && /^[一二兩三四五六七八九]$/.test(lowSection)) {
      return high * 10000 + low * 1000;
    }

    return high * 10000 + low;
  }

  private parseChineseNumberSection(section: string): number {
    if (section === '') {
      return 0;
    }

    let total = 0;
    let digit: number | null = null;
    let previousUnit = 10000;
    let hasZeroAfterUnit = false;

    for (const char of section) {
      if (char in CHINESE_DIGITS) {
        digit = CHINESE_DIGITS[char];
        if (digit === 0) {
          hasZeroAfterUnit = true;
        }
        continue;
      }

      const unit = CHINESE_UNITS[char];
      if (!unit || unit >= previousUnit) {
        return NaN;
      }

      total += (digit ?? 1) * unit;
      digit = null;
      previousUnit = unit;
      hasZeroAfterUnit = false;
    }

    if (digit === null) {
      return total;
    }

    if (total > 0 && previousUnit > 10 && !hasZeroAfterUnit) {
      return total + digit * (previousUnit / 10);
    }

    return total + digit;
  }
}
