using Microsoft.EntityFrameworkCore;
using Pulsefolio.Application.Interfaces.Repositories;
using Pulsefolio.Domain.Entities;
using Pulsefolio.Infrastructure.Data; // Where ApplicationDbContext lives

namespace Pulsefolio.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(User user)
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _db.Users.FindAsync(id);
            if (entity != null)
            {
                _db.Users.Remove(entity);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _db.Users.FindAsync(id);
        }

        public async Task UpdateAsync(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _db.Users.AsNoTracking().ToListAsync();
        }
    }
}
