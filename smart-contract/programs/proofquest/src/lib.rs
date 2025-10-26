use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use std::str::FromStr;

declare_id!("ProofQuest111111111111111111111111111111111");

#[program]
pub mod proofquest {
    use super::*;

    pub fn create_task(
        ctx: Context<CreateTask>,
        amount: u64,
        description: String,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.poster = ctx.accounts.poster.key();
        task.amount = amount;
        task.description = description;
        task.status = TaskStatus::Open;
        task.created_at = Clock::get()?.unix_timestamp;
        task.bump = ctx.bumps.task;

        // Transfer SOL to escrow
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.poster_token_account.to_account_info(),
                to: ctx.accounts.escrow_token_account.to_account_info(),
                authority: ctx.accounts.poster.to_account_info(),
            },
        );
        token::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn accept_task(ctx: Context<AcceptTask>) -> Result<()> {
        let task = &mut ctx.accounts.task;
        require!(task.status == TaskStatus::Open, ErrorCode::TaskNotOpen);
        
        task.worker = Some(ctx.accounts.worker.key());
        task.status = TaskStatus::InProgress;
        task.accepted_at = Some(Clock::get()?.unix_timestamp);

        Ok(())
    }

    pub fn submit_proof(
        ctx: Context<SubmitProof>,
        ipfs_hash: String,
        location: Location,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        require!(task.status == TaskStatus::InProgress, ErrorCode::TaskNotInProgress);
        require!(task.worker == Some(ctx.accounts.worker.key()), ErrorCode::NotAuthorizedWorker);

        task.proof = Some(Proof {
            ipfs_hash,
            location,
            submitted_at: Clock::get()?.unix_timestamp,
        });
        task.status = TaskStatus::PendingVerification;

        Ok(())
    }

    pub fn verify_and_release(
        ctx: Context<VerifyAndRelease>,
        valid_proof: bool,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        require!(task.status == TaskStatus::PendingVerification, ErrorCode::TaskNotPendingVerification);
        require!(task.poster == ctx.accounts.poster.key(), ErrorCode::NotAuthorizedPoster);

        if valid_proof {
            // Release payment to worker
            let worker = task.worker.ok_or(ErrorCode::NoWorker)?;
            let seeds = &[
                b"escrow",
                task.key().as_ref(),
                &[task.bump],
            ];
            let signer = &[&seeds[..]];

            let cpi_context = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.worker_token_account.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                },
                signer,
            );
            token::transfer(cpi_context, task.amount)?;

            task.status = TaskStatus::Completed;
            
            // Mint reputation NFT
            Self::mint_reputation_nft(ctx, worker, 1)?;
        } else {
            // Return payment to poster
            let cpi_context = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.escrow_token_account.to_account_info(),
                    to: ctx.accounts.poster_token_account.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                },
                &[&seeds[..]],
            );
            token::transfer(cpi_context, task.amount)?;

            task.status = TaskStatus::Rejected;
        }

        Ok(())
    }

    pub fn mint_reputation_nft(
        ctx: Context<MintReputationNft>,
        user: Pubkey,
        score: u8,
    ) -> Result<()> {
        let reputation_nft = &mut ctx.accounts.reputation_nft;
        reputation_nft.user = user;
        reputation_nft.score = score;
        reputation_nft.minted_at = Clock::get()?.unix_timestamp;
        reputation_nft.bump = ctx.bumps.reputation_nft;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTask<'info> {
    #[account(
        init,
        payer = poster,
        space = 8 + Task::INIT_SPACE,
        seeds = [b"task", poster.key().as_ref()],
        bump
    )]
    pub task: Account<'info, Task>,
    
    #[account(mut)]
    pub poster: Signer<'info>,
    
    #[account(mut)]
    pub poster_token_account: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = poster,
        token::mint = mint,
        token::authority = escrow,
        seeds = [b"escrow", task.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    pub escrow: SystemAccount<'info>,
    pub mint: Account<'info, token::Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptTask<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    pub worker: Signer<'info>,
}

#[derive(Accounts)]
pub struct SubmitProof<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    pub worker: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyAndRelease<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    pub poster: Signer<'info>,
    
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub worker_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub poster_token_account: Account<'info, TokenAccount>,
    
    pub escrow: SystemAccount<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct MintReputationNft<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + ReputationNft::INIT_SPACE,
        seeds = [b"reputation", user.key().as_ref()],
        bump
    )]
    pub reputation_nft: Account<'info, ReputationNft>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub user: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Task {
    pub poster: Pubkey,
    pub worker: Option<Pubkey>,
    pub amount: u64,
    pub description: String,
    pub status: TaskStatus,
    pub proof: Option<Proof>,
    pub created_at: i64,
    pub accepted_at: Option<i64>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ReputationNft {
    pub user: Pubkey,
    pub score: u8,
    pub minted_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TaskStatus {
    Open,
    InProgress,
    PendingVerification,
    Completed,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Proof {
    pub ipfs_hash: String,
    pub location: Location,
    pub submitted_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Location {
    pub latitude: f64,
    pub longitude: f64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Task is not open")]
    TaskNotOpen,
    #[msg("Task is not in progress")]
    TaskNotInProgress,
    #[msg("Task is not pending verification")]
    TaskNotPendingVerification,
    #[msg("Not authorized worker")]
    NotAuthorizedWorker,
    #[msg("Not authorized poster")]
    NotAuthorizedPoster,
    #[msg("No worker assigned")]
    NoWorker,
}
