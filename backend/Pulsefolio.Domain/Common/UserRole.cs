namespace Pulsefolio.Domain.Common
{
    /// <summary>
    /// Defines user roles with hierarchical permissions.
    /// Higher values include permissions of lower values.
    /// </summary>
    public enum UserRole
    {
        /// <summary>Basic user with standard portfolio access.</summary>
        User = 0,
        
        /// <summary>Analyst with access to analytics features.</summary>
        Analyst = 1,
        
        /// <summary>Administrator with full system access.</summary>
        Admin = 2
    }
}
