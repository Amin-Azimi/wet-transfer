import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column()
  public owner: string;

  @Column()
  public coordinates: string;

  @Column()
  public size: number;

  @Column()
  public yield: number;

  @Column()
  public distance_text: string;

  @Column()
  public distance_value: number;

  @Column()
  public user_id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
