import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../storage';

describe('StorageService Repository', () => {
  beforeEach(() => {
    StorageService.resetAllData();
  });

  it('retrieves default demo clubs and events', async () => {
    const clubs = await StorageService.getClubs();
    const events = await StorageService.getEvents();
    expect(clubs.length).toBeGreaterThanOrEqual(6);
    expect(events.length).toBeGreaterThanOrEqual(8);
  });

  it('prevents duplicate pending collaboration requests between the same clubs', async () => {
    const initialCollabs = await StorageService.getCollaborationRequests();
    const pendingReq = initialCollabs.find((c) => c.status === 'pending');
    expect(pendingReq).toBeDefined();

    if (pendingReq) {
      // Attempt to send another request from the same initiator to target
      const attempt = await StorageService.createCollaborationRequest({
        initiatorClubId: pendingReq.initiatorClubId,
        initiatorClubName: pendingReq.initiatorClubName,
        initiatorCollegeName: pendingReq.initiatorCollegeName,
        initiatorUserId: 'usr-alex',
        initiatorUserName: 'Alex Chen',
        targetClubId: pendingReq.targetClubId,
        targetClubName: pendingReq.targetClubName,
        targetCollegeName: pendingReq.targetCollegeName,
        collabType: 'Cross-Campus Hackathon',
        message: 'Second duplicate proposal attempt',
        compatibilityScore: 90,
      });

      expect(attempt.success).toBe(false);
      expect(attempt.error).toContain('already active');
    }
  });

  it('successfully transitions collaboration status', async () => {
    const collabs = await StorageService.getCollaborationRequests();
    const req = collabs[0];

    const updated = await StorageService.updateCollaborationStatus(req.id, 'accepted');
    expect(updated?.status).toBe('accepted');

    const refetched = await StorageService.getCollaborationRequests();
    const target = refetched.find((c) => c.id === req.id);
    expect(target?.status).toBe('accepted');
  });

  it('registers user for an event and prevents duplicate registration', async () => {
    const events = await StorageService.getEvents();
    const ev = events[0];
    const initialCount = ev.registeredCount;

    const res1 = await StorageService.registerForEvent(ev.id, 'usr-test-1');
    expect(res1.success).toBe(true);

    const updatedEv = await StorageService.getEventById(ev.id);
    expect(updatedEv?.registeredCount).toBe(initialCount + 1);

    // Duplicate check
    const res2 = await StorageService.registerForEvent(ev.id, 'usr-test-1');
    expect(res2.success).toBe(false);
    expect(res2.message).toContain('already registered');
  });
});
