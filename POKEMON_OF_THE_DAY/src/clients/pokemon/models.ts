export interface PokemonTypeSearchResult {
  name: string;
  url: string;
}

export interface PokemonType {
  id: number;
  name: string;
  damage_relations: DamageRelations;
  past_damage_relations: PastDamageRelation[];
  game_indices: Index[];
  generation: Generation3;
  move_damage_class: MoveDamageClass;
  names: Name[];
  pokemon: PokemonListElement[];
  moves: Mfe[];
}

export interface DamageRelations {
  no_damage_to: NoDamageTo[];
  half_damage_to: HalfDamageTo[];
  double_damage_to: DoubleDamageTo[];
  no_damage_from: NoDamageFrom[];
  half_damage_from: HalfDamageFrom[];
  double_damage_from: DoubleDamageFrom[];
}

export interface NoDamageTo {
  name: string;
  url: string;
}

export interface HalfDamageTo {
  name: string;
  url: string;
}

export interface DoubleDamageTo {
  name: string;
  url: string;
}

export interface NoDamageFrom {
  name: string;
  url: string;
}

export interface HalfDamageFrom {
  name: string;
  url: string;
}

export interface DoubleDamageFrom {
  name: string;
  url: string;
}

export interface PastDamageRelation {
  generation: Generation;
  damage_relations: DamageRelations2;
}

export interface Generation {
  name: string;
  url: string;
}

export interface DamageRelations2 {
  no_damage_to: NoDamageTo2[];
  half_damage_to: HalfDamageTo2[];
  double_damage_to: DoubleDamageTo2[];
  no_damage_from: NoDamageFrom2[];
  half_damage_from: HalfDamageFrom2[];
  double_damage_from: DoubleDamageFrom2[];
}

export interface NoDamageTo2 {
  name: string;
  url: string;
}

export interface HalfDamageTo2 {
  name: string;
  url: string;
}

export interface DoubleDamageTo2 {
  name: string;
  url: string;
}

export interface NoDamageFrom2 {
  name: string;
  url: string;
}

export interface HalfDamageFrom2 {
  name: string;
  url: string;
}

export interface DoubleDamageFrom2 {
  name: string;
  url: string;
}

export interface Index {
  game_index: number;
  generation: Generation2;
}

export interface Generation2 {
  name: string;
  url: string;
}

export interface Generation3 {
  name: string;
  url: string;
}

export interface MoveDamageClass {
  name: string;
  url: string;
}

export interface Name {
  name: string;
  language: Language;
}

export interface Language {
  name: string;
  url: string;
}

export interface PokemonListElement {
  slot: number;
  pokemon: PokemonSearchResult;
}

export interface PokemonSearchResult {
  name: string;
  url: string;
}

export interface Mfe {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: Ability[];
  forms: Form[];
  game_indices: Index[];
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: Mfe[];
  species: Species;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  past_types: PastType[];
}

export interface Ability {
  is_hidden: boolean;
  slot: number;
  ability: Ability2;
}

export interface Ability2 {
  name: string;
  url: string;
}

export interface Form {
  name: string;
  url: string;
}

export interface Index {
  game_index: number;
  version: Version;
}

export interface Version {
  name: string;
  url: string;
}

export interface HeldItem {
  item: Item;
  version_details: VersionDetail[];
}

export interface Item {
  name: string;
  url: string;
}

export interface VersionDetail {
  rarity: number;
  version: Version2;
}

export interface Version2 {
  name: string;
  url: string;
}

export interface Mfe {
  move: Move;
  version_group_details: VersionGroupDetail[];
}

export interface Move {
  name: string;
  url: string;
}

export interface VersionGroupDetail {
  level_learned_at: number;
  version_group: VersionGroup;
  move_learn_method: MoveLearnMethod;
}

export interface VersionGroup {
  name: string;
  url: string;
}

export interface MoveLearnMethod {
  name: string;
  url: string;
}

export interface Species {
  name: string;
  url: string;
}

export interface Sprites {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
  other: Other;
  versions: Versions;
}

export interface Other {
  dream_world: DreamWorld;
  home: Home;
  "official-artwork": OfficialArtwork;
}

export interface DreamWorld {
  front_default: string;
  front_female: any;
}

export interface Home {
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface OfficialArtwork {
  front_default: string;
}

export interface Versions {
  "generation-i": GenerationI;
  "generation-ii": GenerationIi;
  "generation-iii": GenerationIii;
  "generation-iv": GenerationIv;
  "generation-v": GenerationV;
  "generation-vi": GenerationVi;
  "generation-vii": GenerationVii;
  "generation-viii": GenerationViii;
}

export interface GenerationI {
  "red-blue": RedBlue;
  yellow: Yellow;
}

export interface RedBlue {
  back_default: string;
  back_gray: string;
  front_default: string;
  front_gray: string;
}

export interface Yellow {
  back_default: string;
  back_gray: string;
  front_default: string;
  front_gray: string;
}

export interface GenerationIi {
  crystal: Crystal;
  gold: Gold;
  silver: Silver;
}

export interface Crystal {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface Gold {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface Silver {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface GenerationIii {
  emerald: Emerald;
  "firered-leafgreen": FireredLeafgreen;
  "ruby-sapphire": RubySapphire;
}

export interface Emerald {
  front_default: string;
  front_shiny: string;
}

export interface FireredLeafgreen {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface RubySapphire {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
}

export interface GenerationIv {
  "diamond-pearl": DiamondPearl;
  "heartgold-soulsilver": HeartgoldSoulsilver;
  platinum: Platinum;
}

export interface DiamondPearl {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface HeartgoldSoulsilver {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface Platinum {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface GenerationV {
  "black-white": BlackWhite;
}

export interface BlackWhite {
  animated: Animated;
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface Animated {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface GenerationVi {
  "omegaruby-alphasapphire": OmegarubyAlphasapphire;
  "x-y": XY;
}

export interface OmegarubyAlphasapphire {
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface XY {
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface GenerationVii {
  icons: Icons;
  "ultra-sun-ultra-moon": UltraSunUltraMoon;
}

export interface Icons {
  front_default: string;
  front_female: any;
}

export interface UltraSunUltraMoon {
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
}

export interface GenerationViii {
  icons: Icons2;
}

export interface Icons2 {
  front_default: string;
  front_female: any;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Stat2;
}

export interface Stat2 {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: Type2;
}

export interface Type2 {
  name: string;
  url: string;
}

export interface PastType {
  generation: Generation;
  types: Type3[];
}

export interface Generation {
  name: string;
  url: string;
}

export interface Type3 {
  slot: number;
  type: Type4;
}

export interface Type4 {
  name: string;
  url: string;
}
