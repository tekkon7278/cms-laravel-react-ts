export interface EntityInterface {
    set id(id: number);
    get id(): number;
    fillProps(data: Object): void;
}
