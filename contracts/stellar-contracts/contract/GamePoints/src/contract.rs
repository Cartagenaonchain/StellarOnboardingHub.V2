//! Ownable Example Contract.
//!
//! Demonstrates an example usage of `ownable` module by
//! implementing `#[only_owner]` macro on a sensitive function.

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol,log,Vec};
use stellar_default_impl_macro::default_impl;
use stellar_ownable::{set_owner, Ownable};
use stellar_ownable_macro::only_owner;

// Symbols for storage
const POINTS: Symbol = symbol_short!("POINTS");
const PLAYER_COUNT: Symbol = symbol_short!("PLAYERS");
const GAME_HISTORY: Symbol = symbol_short!("HISTORY");

#[contracttype]
pub enum DataKey {
    Owner,
    Points(Address),
    Player_count,
    game_history(Address),
}
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PlayerScore {
    pub player: Address,
    pub points: u64,
    pub game_id: u32,
    pub timestamp: u64,
}
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GameResult {
    pub player: Address,
    pub points_awarded: u64,
    pub game_id: u32,
    pub timestamp: u64,
}

#[contract]
pub struct GamepointsContract;

#[contractimpl]
impl GamepointsContract {
    pub fn __constructor(env: &Env, owner: Address) {
        set_owner(env, &owner);
        
    }
    /// Get points for a specific player (public function)
    fn get_player_points(env: Env, player: Address) -> u64 {
        let player_key = DataKey::Points((player));
        env.storage().persistent().get(&player_key).unwrap_or(0)
    }

    
    /// Get complete information for a player
    pub fn get_player_info(env: Env, player: Address) -> PlayerScore {
        let points = Self::get_player_points(env.clone(), player.clone());
        PlayerScore {
            player: player.clone(),
            points,
            game_id: 0, // Generic ID for status query
            timestamp: env.ledger().timestamp(),
        }
    }

     /// Get player ranking (simulated - in production you would need indexing)
    pub fn get_leaderboard(env: Env, limit: u32) -> Vec<PlayerScore> {
        let mut leaderboard = Vec::new(&env);
        
        // This is a simplified implementation for demo
        // In production, you would need a more efficient indexing system
        // For example, maintaining a sorted list or using a secondary index
        
        leaderboard
    }

    #[only_owner]
    // Add points to a player (only the owner can do this)

    /// Add points to a player (only the owner can do this)
    pub fn add_points(env: Env, player: Address, points: u64, game_id: u32) -> u64 {
        // Validate that points are greater than 0
        assert!(points > 0, "Points must be greater than 0");

        // Get current player points
        let current_points = Self::get_player_points(env.clone(), player.clone());
        let new_points = current_points + points;

        // Create key for the player
        let player_key = DataKey::Points((player.clone()));

        // Update player points
        env.storage().persistent().set(&player_key, &new_points);

        // If it's a new player, increment the counter
        if current_points == 0 {
            let player_count: u32 = env.storage().instance().get(&DataKey::Player_count).unwrap_or(0);
            env.storage().instance().set(&DataKey::Player_count, &(player_count.clone() + 1));
        }

        // Create game result record
        let game_result = GameResult {
            player: player.clone(),
            points_awarded: points,
            game_id,
            timestamp: env.ledger().timestamp(),
        };

        // Save to history using timestamp + game_id as unique key
        let history_key = (DataKey::game_history(player), env.ledger().timestamp(), game_id);
        env.storage().persistent().set(&history_key, &game_result);
   

        new_points
    }
    /// Reset points for a specific player (owner only)
    pub fn reset_player_points(env: Env, player: Address) -> u64 {
   
        
        let player_key = DataKey::Points(player.clone());

        let old_points = env.storage().persistent().get(&player_key).unwrap_or(0);
        
        // Only reset if the player had points
        if old_points > 0 {
            env.storage().persistent().remove(&player_key);
            
            // Decrement player counter
            let player_count: u32 = env.storage().instance().get(&PLAYER_COUNT).unwrap_or(0);
            if player_count > 0 {
                env.storage().instance().set(&PLAYER_COUNT, &(player_count.clone() - 1));
            }
            
        }
        // Emit event
            env.events().publish(
                (symbol_short!("POINTS"), symbol_short!("RESET")),
                (player.clone(), old_points)
            );
        
        old_points
    }
    

 
}

#[default_impl]
#[contractimpl]
impl Ownable for GamepointsContract {}