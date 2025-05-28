import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { VendorService } from '../vendor/vendor.service';
import { SiteService } from '../site/site.service';
import { MaterialStatus } from '../common/enums/material-status.enum';
import { OrderMaterialDto } from './dto/order-material.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    private vendorService: VendorService,
    private siteService: SiteService,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    // Verify site exists
    await this.siteService.findOne(createMaterialDto.siteId);
    
    const material = this.materialRepository.create({
      ...createMaterialDto,
      status: MaterialStatus.REQUESTED
    });
    return this.materialRepository.save(material);
  }

  async findAll(userRole: Role, userId?: string): Promise<Material[]> {
    const queryBuilder = this.materialRepository.createQueryBuilder('material')
      .leftJoinAndSelect('material.vendor', 'vendor')
      .leftJoinAndSelect('material.site', 'site')
      .leftJoinAndSelect('material.requestedBy', 'requestedBy')
      .select([
        'material',
        'vendor.id',
        'vendor.name',
        'site.id',
        'site.name',
        'requestedBy.id',
        'requestedBy.name',
        'requestedBy.email',
        'requestedBy.role'
      ]);

    // If user is site engineer, only show their requests
    if (userRole === Role.SITE_ENGINEER && userId) {
      queryBuilder.where('requestedBy.id = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['vendor', 'site', 'requestedBy'],
      select: {
        requestedBy: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    });
    
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    
    return material;
  }

  async updateStatus(id: string, status: MaterialStatus, orderDto?: OrderMaterialDto): Promise<Material> {
    const material = await this.findOne(id);
    
    // Validate status transitions
    this.validateStatusTransition(material.status, status);
    
    // If ordering, verify vendor and set vendorId
    if (status === MaterialStatus.ORDERED) {
      if (!orderDto?.vendorId) {
        throw new BadRequestException('Vendor ID is required when ordering materials');
      }
      await this.vendorService.findOne(orderDto.vendorId);
      material.vendorId = orderDto.vendorId;
    }
    
    material.status = status;
    return this.materialRepository.save(material);
  }

  private validateStatusTransition(currentStatus: MaterialStatus, newStatus: MaterialStatus): void {
    const validTransitions = {
      [MaterialStatus.REQUESTED]: [MaterialStatus.APPROVED, MaterialStatus.REJECTED],
      [MaterialStatus.APPROVED]: [MaterialStatus.ORDERED],
      [MaterialStatus.ORDERED]: [MaterialStatus.DELIVERED],
      [MaterialStatus.REJECTED]: [],
      [MaterialStatus.DELIVERED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  async remove(id: string): Promise<void> {
    const material = await this.findOne(id);
    
    // Only allow deletion if status is REQUESTED
    if (material.status !== MaterialStatus.REQUESTED) {
      throw new BadRequestException(
        'Can only cancel material requests that are in REQUESTED status'
      );
    }
    
    await this.materialRepository.remove(material);
  }
}